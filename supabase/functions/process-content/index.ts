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
    if (userErr || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const userId = user.id;
    const { job_id } = await req.json();

    const adminClient = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    const { data: job } = await adminClient.from("content_jobs").select("*").eq("id", job_id).single();
    if (!job) throw new Error("Job not found");

    const { data: source } = await adminClient.from("content_sources").select("*").eq("job_id", job_id).order("created_at", { ascending: false }).limit(1).single();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const prompt = `Analyze the following content and create a structured brief.

Title: ${job.title}
Content Type: ${job.content_type}
Guest: ${job.guest_name || "N/A"}
Product: ${job.product_name || "N/A"}
Target Audience: ${job.target_audience || "General"}
Transcript: ${source?.transcript_text?.substring(0, 8000) || "Not provided"}
Research Notes: ${source?.research_notes || "Not provided"}

Create a comprehensive content brief.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "You are an editorial content strategist. Create structured content briefs from raw materials." },
          { role: "user", content: prompt },
        ],
        tools: [{
          type: "function",
          function: {
            name: "create_brief",
            description: "Create a structured content brief",
            parameters: {
              type: "object",
              properties: {
                summary: { type: "string" },
                key_insights: { type: "array", items: { type: "string" } },
                key_quotes: { type: "array", items: { type: "string" } },
                angles: { type: "array", items: { type: "string" } },
                headline_options: { type: "array", items: { type: "string" } },
                newsletter_angle: { type: "string" },
                article_angle: { type: "string" },
                social_hooks: { type: "array", items: { type: "string" } },
              },
              required: ["summary", "key_insights", "headline_options", "newsletter_angle", "article_angle"],
              additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "create_brief" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) return new Response(JSON.stringify({ error: "Rate limited, try again later" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (response.status === 402) return new Response(JSON.stringify({ error: "Credits exhausted" }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      throw new Error(`AI error: ${response.status}`);
    }

    const aiData = await response.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    const briefData = toolCall ? JSON.parse(toolCall.function.arguments) : {};

    const { data: existing } = await adminClient.from("content_briefs").select("version").eq("job_id", job_id).order("version", { ascending: false }).limit(1);
    const nextVersion = (existing?.[0]?.version || 0) + 1;

    await adminClient.from("content_briefs").insert({
      job_id,
      summary: briefData.summary || "",
      key_insights: briefData.key_insights || [],
      key_quotes: briefData.key_quotes || [],
      angles: briefData.angles || [],
      headline_options: briefData.headline_options || [],
      newsletter_angle: briefData.newsletter_angle || "",
      article_angle: briefData.article_angle || "",
      social_hooks: briefData.social_hooks || [],
      version: nextVersion,
    });

    await adminClient.from("content_jobs").update({ status: "brief_ready" }).eq("id", job_id);
    await adminClient.from("activity_log").insert({ job_id, user_id: userId, action_type: "brief_generated", details: `Brief v${nextVersion} generated` });

    return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("process-content error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
