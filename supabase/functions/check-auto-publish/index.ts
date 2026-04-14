import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.95.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { job_id } = await req.json();
    if (!job_id) throw new Error("job_id required");

    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Check if auto-publish is enabled
    const { data: settings } = await adminClient
      .from("editor_settings")
      .select("auto_publish_enabled")
      .limit(1)
      .single();

    if (!settings?.auto_publish_enabled) {
      return new Response(JSON.stringify({ skipped: true, reason: "auto_publish disabled" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Run readiness checks
    const { data: job } = await adminClient.from("content_jobs").select("*").eq("id", job_id).single();
    if (!job) throw new Error("Job not found");

    // Already publishing or published?
    if (job.status === "publishing" || job.status === "published") {
      return new Response(JSON.stringify({ skipped: true, reason: "already publishing" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Brief approved?
    const { data: brief } = await adminClient
      .from("content_briefs")
      .select("approved")
      .eq("job_id", job_id)
      .order("version", { ascending: false })
      .limit(1)
      .single();
    if (!brief?.approved) {
      return new Response(JSON.stringify({ skipped: true, reason: "brief not approved" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Newsletter approved?
    const { data: newsletter } = await adminClient
      .from("content_outputs")
      .select("approved")
      .eq("job_id", job_id)
      .eq("output_group", "newsletter")
      .order("version", { ascending: false })
      .limit(1)
      .single();
    if (!newsletter?.approved) {
      return new Response(JSON.stringify({ skipped: true, reason: "newsletter not approved" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Article approved?
    const { data: article } = await adminClient
      .from("content_outputs")
      .select("approved")
      .eq("job_id", job_id)
      .eq("output_group", "article")
      .order("version", { ascending: false })
      .limit(1)
      .single();
    if (!article?.approved) {
      return new Response(JSON.stringify({ skipped: true, reason: "article not approved" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // All social approved?
    const { data: socialOutputs } = await adminClient
      .from("content_outputs")
      .select("channel, approved")
      .eq("job_id", job_id)
      .eq("output_group", "social");
    const allSocialApproved = socialOutputs && socialOutputs.length > 0 && socialOutputs.every((s) => s.approved);
    if (!allSocialApproved) {
      return new Response(JSON.stringify({ skipped: true, reason: "social not all approved" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // CTA configured?
    if (!job.primary_cta_url) {
      return new Response(JSON.stringify({ skipped: true, reason: "CTA not configured" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // All checks passed — get active targets and publish
    const { data: targets } = await adminClient
      .from("publishing_targets")
      .select("*")
      .eq("active", true);

    if (!targets || targets.length === 0) {
      return new Response(JSON.stringify({ skipped: true, reason: "no active publishing targets" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get approved outputs for payload
    const { data: outputs } = await adminClient
      .from("content_outputs")
      .select("*")
      .eq("job_id", job_id)
      .eq("approved", true);

    const results = [];

    for (const target of targets) {
      const payload = {
        job_id,
        title: job.title,
        content_type: job.content_type,
        guest_name: job.guest_name,
        product_name: job.product_name,
        destination: target.name.toLowerCase(),
        outputs: outputs?.map((o) => ({
          group: o.output_group,
          channel: o.channel,
          title: o.title,
          body: o.body,
          meta_title: o.meta_title,
          meta_description: o.meta_description,
          slug: o.slug,
        })) || [],
        cta: {
          primary: { label: job.primary_cta_label, url: job.primary_cta_url },
          secondary: { label: job.secondary_cta_label, url: job.secondary_cta_url },
        },
      };

      let status = "sent";
      let responseCode = 200;
      let responseBody = "";
      let errorMessage: string | null = null;

      if (target.webhook_url) {
        try {
          const res = await fetch(target.webhook_url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          responseCode = res.status;
          responseBody = await res.text();
          if (!res.ok) {
            status = "failed";
            errorMessage = `HTTP ${responseCode}: ${responseBody.substring(0, 500)}`;
          }
        } catch (err) {
          status = "failed";
          errorMessage = err instanceof Error ? err.message : "Webhook call failed";
          responseCode = 0;
        }
      } else {
        responseBody = "No webhook URL configured. Payload saved.";
      }

      await adminClient.from("publishing_jobs").insert({
        job_id,
        destination: target.name.toLowerCase(),
        payload_json: payload,
        status,
        response_code: responseCode,
        response_body: responseBody,
        error_message: errorMessage,
      });

      results.push({ destination: target.name, status });
    }

    // Update job status
    await adminClient.from("content_jobs").update({ status: "publishing" }).eq("id", job_id);

    // Log auto-publish
    await adminClient.from("activity_log").insert({
      job_id,
      action_type: "auto_publish",
      details: `Auto-published to ${results.map((r) => r.destination).join(", ")}`,
    });

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("check-auto-publish error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
