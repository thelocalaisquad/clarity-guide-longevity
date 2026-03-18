import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, XCircle } from "lucide-react";

interface Props { job: any; }

const StepReview = ({ job }: Props) => {
  const { data: brief } = useQuery({
    queryKey: ["review-brief", job.id],
    queryFn: async () => {
      const { data } = await supabase.from("content_briefs").select("approved").eq("job_id", job.id).order("version", { ascending: false }).limit(1).single();
      return data;
    },
  });

  const { data: newsletter } = useQuery({
    queryKey: ["review-newsletter", job.id],
    queryFn: async () => {
      const { data } = await supabase.from("content_outputs").select("approved").eq("job_id", job.id).eq("output_group", "newsletter").order("version", { ascending: false }).limit(1).single();
      return data;
    },
  });

  const { data: article } = useQuery({
    queryKey: ["review-article", job.id],
    queryFn: async () => {
      const { data } = await supabase.from("content_outputs").select("approved").eq("job_id", job.id).eq("output_group", "article").order("version", { ascending: false }).limit(1).single();
      return data;
    },
  });

  const { data: socialOutputs } = useQuery({
    queryKey: ["review-social", job.id],
    queryFn: async () => {
      const { data } = await supabase.from("content_outputs").select("channel, approved").eq("job_id", job.id).eq("output_group", "social");
      return data || [];
    },
  });

  const allSocialApproved = socialOutputs && socialOutputs.length > 0 && socialOutputs.every((s) => s.approved);

  const checks = [
    { label: "Brief approved", done: brief?.approved },
    { label: "Newsletter approved", done: newsletter?.approved },
    { label: "Article approved", done: article?.approved },
    { label: "All social channels approved", done: allSocialApproved },
    { label: "CTA links configured", done: !!job.primary_cta_url },
  ];

  const allReady = checks.every((c) => c.done);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium">Readiness Checklist</h2>

      <div className="space-y-3">
        {checks.map((c, i) => (
          <div key={i} className="flex items-center gap-3 p-3 border rounded-md">
            {c.done ? <CheckCircle className="h-5 w-5 text-emerald-600" /> : <XCircle className="h-5 w-5 text-muted-foreground" />}
            <span className="text-sm">{c.label}</span>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-md border bg-card">
        {allReady ? (
          <p className="text-sm text-emerald-600 font-medium">✓ All checks passed. Ready to publish.</p>
        ) : (
          <p className="text-sm text-muted-foreground">Complete all checks before publishing.</p>
        )}
      </div>
    </div>
  );
};

export default StepReview;
