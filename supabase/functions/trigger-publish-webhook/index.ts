import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.95.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, { global: { headers: { Authorization: authHeader } } });
    const { data: claims, error: claimsErr } = await supabase.auth.getClaims(authHeader.replace("Bearer ", ""));
    if (claimsErr || !claims?.claims) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const userId = claims.claims.sub as string;
    const { job_id, destination, publishing_job_id } = await req.json();
    const adminClient = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    const { data: job } = await adminClient.from("content_jobs").select("*").eq("id", job_id).single();
    if (!job) throw new Error("Job not found");

    // Get all approved outputs
    const { data: outputs } = await adminClient.from("content_outputs").select("*").eq("job_id", job_id).eq("approved", true);

    // Build payload
    const payload = {
      job_id,
      title: job.title,
      content_type: job.content_type,
      guest_name: job.guest_name,
      product_name: job.product_name,
      destination,
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

    // Find webhook target
    const { data: targets } = await adminClient.from("publishing_targets").select("*").eq("active", true);
    const target = targets?.find((t) => t.name.toLowerCase().includes(destination) || t.target_type === destination);

    let responseCode = 200;
    let responseBody = "";
    let errorMessage: string | null = null;
    let status = "sent";

    if (target?.webhook_url) {
      try {
        const webhookRes = await fetch(target.webhook_url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        responseCode = webhookRes.status;
        responseBody = await webhookRes.text();
        if (!webhookRes.ok) {
          status = "failed";
          errorMessage = `HTTP ${responseCode}: ${responseBody.substring(0, 500)}`;
        }
      } catch (err) {
        status = "failed";
        errorMessage = err instanceof Error ? err.message : "Webhook call failed";
        responseCode = 0;
      }
    } else {
      // No webhook configured — just save the payload
      responseBody = "No webhook configured for this destination. Payload saved.";
    }

    // Update or create publishing job
    if (publishing_job_id) {
      await adminClient.from("publishing_jobs").update({
        payload_json: payload, status, response_code: responseCode, response_body: responseBody, error_message: errorMessage,
      }).eq("id", publishing_job_id);
    } else {
      await adminClient.from("publishing_jobs").insert({
        job_id, destination, payload_json: payload, status, response_code: responseCode, response_body: responseBody, error_message: errorMessage,
      });
    }

    await adminClient.from("activity_log").insert({
      job_id, user_id: userId, action_type: "publish_attempted",
      details: `Published to ${destination}: ${status}`,
    });

    return new Response(JSON.stringify({ success: status === "sent", status }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("trigger-publish-webhook error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
