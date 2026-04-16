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
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    // Validate auth
    const { data: { user }, error: authErr } = await supabase.auth.getUser();
    if (authErr || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { job_id } = await req.json();
    if (!job_id) {
      return new Response(JSON.stringify({ error: "job_id required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Fetch job
    const { data: job, error: jobErr } = await adminClient
      .from("content_jobs").select("*").eq("id", job_id).single();
    if (jobErr || !job) throw new Error("Job not found");

    // Fetch approved article output
    const { data: articleOutput } = await adminClient
      .from("content_outputs")
      .select("*")
      .eq("job_id", job_id)
      .eq("output_group", "article")
      .eq("approved", true)
      .order("version", { ascending: false })
      .limit(1)
      .single();

    if (!articleOutput) throw new Error("No approved article output found for this job");

    // Fetch video URL from content_sources
    const { data: source } = await adminClient
      .from("content_sources")
      .select("video_url")
      .eq("job_id", job_id)
      .limit(1)
      .single();

    // Fetch approved visual asset for og_image
    const { data: visualAsset } = await adminClient
      .from("visual_assets")
      .select("image_url")
      .eq("job_id", job_id)
      .eq("approved", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    let ogImageUrl: string | null = null;
    if (visualAsset?.image_url) {
      const url = visualAsset.image_url;
      const signMatch = url.match(/\/object\/sign\/(.+?)(?:\?|$)/);
      const pubMatch = url.match(/\/object\/public\/(.+?)(?:\?|$)/);
      const path = signMatch?.[1] || pubMatch?.[1];
      if (path) {
        ogImageUrl = `${Deno.env.get("SUPABASE_URL")}/storage/v1/object/public/${path}`;
      } else {
        ogImageUrl = url;
      }
    }

    // Get next edition number
    const { data: editions } = await adminClient
      .from("editions")
      .select("edition_number")
      .order("created_at", { ascending: false })
      .limit(1);

    let nextNum = 1;
    if (editions && editions.length > 0) {
      const parsed = parseInt(editions[0].edition_number, 10);
      if (!isNaN(parsed)) nextNum = parsed + 1;
    }

    const slug = articleOutput.slug || job.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const canonicalUrl = `https://clarity-guide-longevity.lovable.app/editions/${slug}`;

    // Convert YouTube URL to embed URL
    let videoEmbedUrl: string | null = null;
    if (source?.video_url) {
      const url = source.video_url;
      const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
      if (ytMatch) {
        videoEmbedUrl = `https://www.youtube.com/embed/${ytMatch[1]}`;
      } else {
        videoEmbedUrl = url;
      }
    }

    // Check for existing edition with same slug (upsert)
    const { data: existing } = await adminClient
      .from("editions")
      .select("id")
      .eq("slug", slug)
      .limit(1);

    let editionId: string;

    const editionData = {
      title: articleOutput.title || job.title,
      slug,
      body_html: articleOutput.body,
      meta_description: articleOutput.meta_description,
      expert_name: job.guest_name || null,
      product_name: job.product_name || null,
      product_cta_url: job.primary_cta_url || null,
      canonical_url: canonicalUrl,
      is_published: true,
      category: "Recovery",
      author: "Clarity Guide",
      read_time: "5 min",
      video_embed_url: videoEmbedUrl,
      updated_at: new Date().toISOString(),
    };

    if (existing && existing.length > 0) {
      editionId = existing[0].id;
      await adminClient.from("editions").update(editionData).eq("id", editionId);
    } else {
      const { data: inserted, error: insertErr } = await adminClient
        .from("editions")
        .insert({ ...editionData, edition_number: String(nextNum) })
        .select("id")
        .single();
      if (insertErr) throw insertErr;
      editionId = inserted.id;
    }

    // Log to publishing_jobs
    await adminClient.from("publishing_jobs").insert({
      job_id,
      destination: "website",
      payload_json: editionData,
      status: "sent",
      response_code: 200,
      response_body: `Edition created: ${editionId}`,
    });

    // Log activity
    await adminClient.from("activity_log").insert({
      job_id,
      user_id: user.id,
      action_type: "published_to_website",
      details: `Published edition "${editionData.title}" to website (slug: ${slug})`,
    });

    // Update job status
    await adminClient.from("content_jobs").update({ status: "published" }).eq("id", job_id);

    return new Response(JSON.stringify({ success: true, edition_id: editionId, slug }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("publish-to-website error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
