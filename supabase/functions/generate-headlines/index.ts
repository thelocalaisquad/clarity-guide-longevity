import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { job_id, channel, product_name, social_body } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const systemPrompt = `You are a marketing copywriter for a longevity and wellness brand. Generate exactly 5 short, punchy overlay headlines for social media graphics. Each headline should be:
- Maximum 8 words
- Eye-catching and bold
- Suitable for product marketing visuals
- Different in tone: one provocative, one benefit-driven, one question, one stat-style, one aspirational

Return ONLY a JSON array of 5 strings, no other text.`;

    const userPrompt = `Product: ${product_name || "wellness product"}
Platform: ${channel || "linkedin"}
Social post context: ${social_body || "general product promotion"}

Generate 5 overlay headlines.`;

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
              name: "return_headlines",
              description: "Return generated overlay headlines",
              parameters: {
                type: "object",
                properties: {
                  headlines: {
                    type: "array",
                    items: { type: "string" },
                    minItems: 5,
                    maxItems: 5,
                  },
                },
                required: ["headlines"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "return_headlines" } },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Credits exhausted." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    let headlines: string[] = [];

    if (toolCall?.function?.arguments) {
      const parsed = JSON.parse(toolCall.function.arguments);
      headlines = parsed.headlines || [];
    }

    return new Response(JSON.stringify({ headlines }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-headlines error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
