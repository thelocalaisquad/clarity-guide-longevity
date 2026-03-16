import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { title, summary, category, expertName, expertCredential, productName, productDescription, canonicalUrl } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are a social media content strategist for a longevity technology publication called "Longevity Channel 1". 
Given an article's details, generate ready-to-publish social media posts for each platform.

Return a JSON object using the tool provided. Each post should be tailored to the platform's style, audience, and character limits.

Guidelines:
- LinkedIn: Professional, 1200-1500 chars, include article link placeholder [LINK], use line breaks for readability
- Facebook: Engaging, 300-500 chars, include [LINK], 2-3 relevant hashtags
- Instagram: Visual caption style, 200-400 chars, 15-20 hashtags at the end, no clickable links
- TikTok: Short punchy script/caption, 150-300 chars, 5-8 trending hashtags
- X (Twitter): Thread of 3-4 tweets, each ≤280 chars, numbered 1/4 etc, include [LINK] in last tweet
- Substack: Newsletter teaser paragraph, 200-300 chars, compelling hook to read full article`;

    const userPrompt = `Article details:
Title: ${title}
Category: ${category}
Summary: ${summary}
Expert: ${expertName} — ${expertCredential}
Featured Product: ${productName} — ${productDescription}
Article URL: ${canonicalUrl}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "return_social_posts",
              description: "Return generated social media posts for all platforms",
              parameters: {
                type: "object",
                properties: {
                  linkedin: { type: "string", description: "LinkedIn post" },
                  facebook: { type: "string", description: "Facebook post" },
                  instagram: { type: "string", description: "Instagram caption" },
                  tiktok: { type: "string", description: "TikTok caption/script" },
                  x_thread: {
                    type: "array",
                    items: { type: "string" },
                    description: "Array of tweets forming a thread",
                  },
                  substack: { type: "string", description: "Substack newsletter teaser" },
                },
                required: ["linkedin", "facebook", "instagram", "tiktok", "x_thread", "substack"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "return_social_posts" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please top up in workspace settings." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI generation failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      return new Response(JSON.stringify({ error: "No content generated" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const socialPosts = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(socialPosts), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-social-content error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
