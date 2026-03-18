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
    const { job_id } = await req.json();
    const adminClient = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    const { data: job } = await adminClient.from("content_jobs").select("*").eq("id", job_id).single();
    if (!job) throw new Error("Job not found");

    const { data: brief } = await adminClient.from("content_briefs").select("*").eq("job_id", job_id).order("version", { ascending: false }).limit(1).single();
    const { data: newsletter } = await adminClient.from("content_outputs").select("body").eq("job_id", job_id).eq("output_group", "newsletter").order("version", { ascending: false }).limit(1).single();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const prompt = `Create a full website article based on this content.

Title: ${job.title}
Brief: ${brief?.summary || "N/A"}
Article Angle: ${brief?.article_angle || "N/A"}
Newsletter Draft: ${newsletter?.body?.substring(0, 4000) || "N/A"}
CTA: ${job.primary_cta_label || ""} - ${job.primary_cta_url || ""}

Write a complete SEO-optimized article with title, slug, meta description, body, CTA block, and video embed placeholder.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "You are an SEO content writer for a longevity technology website." },
          { role: "user", content: prompt },
        ],
        tools: [{
          type: "function",
          function: {
            name: "create_article",
            description: "Create article content",
            parameters: {
              type: "object",
              properties: {
                title: { type: "string" },
                slug: { type: "string" },
                meta_title: { type: "string" },
                meta_description: { type: "string" },
                body: { type: "string" },
              },
              required: ["title", "slug", "meta_title", "meta_description", "body"],
              additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "create_article" } },
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

    const { data: existing } = await adminClient.from("content_outputs").select("version").eq("job_id", job_id).eq("output_group", "article").order("version", { ascending: false }).limit(1);
    const nextVersion = (existing?.[0]?.version || 0) + 1;

    await adminClient.from("content_outputs").insert({
      job_id, output_group: "article", channel: "website",
      title: result.title || "", body: result.body || "",
      meta_title: result.meta_title || "", meta_description: result.meta_description || "",
      slug: result.slug || "", version: nextVersion,
    });

    await adminClient.from("activity_log").insert({ job_id, user_id: userId, action_type: "article_generated", details: `Article v${nextVersion} generated` });

    return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("generate-article error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
