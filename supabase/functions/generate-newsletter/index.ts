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
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userErr } = await supabase.auth.getUser();
    if (userErr || !user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const userId = user.id;
    const { job_id } = await req.json();
    const adminClient = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    const { data: job } = await adminClient.from("content_jobs").select("*").eq("id", job_id).single();
    if (!job) throw new Error("Job not found");

    const { data: brief } = await adminClient.from("content_briefs").select("*").eq("job_id", job_id).order("version", { ascending: false }).limit(1).single();

    const { data: source } = await adminClient.from("content_sources").select("*").eq("job_id", job_id).order("created_at", { ascending: false }).limit(1).single();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const prompt = `Create a newsletter draft based on this brief.

Title: ${job.title}
Guest: ${job.guest_name || "N/A"}
Product: ${job.product_name || "N/A"}
Audience: ${job.target_audience || "General"}
Brief Summary: ${brief?.summary || "N/A"}
Newsletter Angle: ${brief?.newsletter_angle || "N/A"}
Key Insights: ${JSON.stringify(brief?.key_insights || [])}
CTA: ${job.primary_cta_label || ""} - ${job.primary_cta_url || ""}
Video URL: ${source?.video_url || "N/A"}

Write a complete newsletter with: headline, hook, main body, expert highlight, product tie-in, CTA block, closing line.${source?.video_url ? ` Include a reference to the video: ${source.video_url}` : ""}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "You are a professional newsletter writer for a longevity technology publication." },
          { role: "user", content: prompt },
        ],
        tools: [{
          type: "function",
          function: {
            name: "create_newsletter",
            description: "Create newsletter content",
            parameters: {
              type: "object",
              properties: {
                title: { type: "string" },
                body: { type: "string" },
              },
              required: ["title", "body"],
              additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "create_newsletter" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) return new Response(JSON.stringify({ error: "Rate limited" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (response.status === 402) return new Response(JSON.stringify({ error: "Credits exhausted" }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      throw new Error(`AI error: ${response.status}`);
    }

    const aiData = await response.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    const result = toolCall ? JSON.parse(toolCall.function.arguments) : {};

    const { data: existing } = await adminClient.from("content_outputs").select("version").eq("job_id", job_id).eq("output_group", "newsletter").order("version", { ascending: false }).limit(1);
    const nextVersion = (existing?.[0]?.version || 0) + 1;

    await adminClient.from("content_outputs").insert({
      job_id,
      output_group: "newsletter",
      channel: "email",
      title: result.title || "",
      body: result.body || "",
      version: nextVersion,
    });

    await adminClient.from("content_jobs").update({ status: "draft_ready" }).eq("id", job_id);
    await adminClient.from("activity_log").insert({ job_id, user_id: userId, action_type: "newsletter_generated", details: `Newsletter v${nextVersion} generated` });

    return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("generate-newsletter error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
