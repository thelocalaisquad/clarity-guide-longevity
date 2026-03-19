import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import EditorLayout from "@/components/editor/EditorLayout";
import { Badge } from "@/components/ui/badge";
import StepIntake from "@/components/editor/steps/StepIntake";
import StepBrief from "@/components/editor/steps/StepBrief";
import StepNewsletter from "@/components/editor/steps/StepNewsletter";
import StepArticle from "@/components/editor/steps/StepArticle";
import StepSocial from "@/components/editor/steps/StepSocial";
import StepVisuals from "@/components/editor/steps/StepVisuals";
import StepReview from "@/components/editor/steps/StepReview";
import StepPublish from "@/components/editor/steps/StepPublish";
import ActivityTimeline from "@/components/editor/ActivityTimeline";
import { cn } from "@/lib/utils";

const STEPS = ["Intake", "Brief", "Newsletter", "Article", "Social", "Visuals", "Review", "Publish"] as const;

const statusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-800",
  processing: "bg-yellow-100 text-yellow-800",
  brief_ready: "bg-indigo-100 text-indigo-800",
  draft_ready: "bg-purple-100 text-purple-800",
  in_review: "bg-orange-100 text-orange-800",
  approved: "bg-emerald-100 text-emerald-800",
  publishing: "bg-cyan-100 text-cyan-800",
  published: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
};

const JobDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [activeStep, setActiveStep] = useState(0);
  const qc = useQueryClient();

  const { data: job, isLoading } = useQuery({
    queryKey: ["content-job", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("content_jobs")
        .select("*")
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const refresh = () => qc.invalidateQueries({ queryKey: ["content-job", id] });

  if (isLoading) {
    return (
      <EditorLayout>
        <p className="text-muted-foreground">Loading job…</p>
      </EditorLayout>
    );
  }

  if (!job) {
    return (
      <EditorLayout>
        <p className="text-muted-foreground">Job not found.</p>
      </EditorLayout>
    );
  }

  const renderStep = () => {
    switch (activeStep) {
      case 0: return <StepIntake job={job} onRefresh={refresh} />;
      case 1: return <StepBrief job={job} onRefresh={refresh} />;
      case 2: return <StepNewsletter job={job} onRefresh={refresh} />;
      case 3: return <StepArticle job={job} onRefresh={refresh} />;
      case 4: return <StepSocial job={job} onRefresh={refresh} />;
      case 5: return <StepReview job={job} />;
      case 6: return <StepPublish job={job} onRefresh={refresh} />;
      default: return null;
    }
  };

  return (
    <EditorLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">{job.title}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {job.content_type} · Created {new Date(job.created_at).toLocaleDateString()}
            </p>
          </div>
          <Badge className={`${statusColors[job.status] || ""} capitalize`}>
            {job.status.replace(/_/g, " ")}
          </Badge>
        </div>

        {/* Step tabs */}
        <div className="flex gap-1 border-b">
          {STEPS.map((step, i) => (
            <button
              key={step}
              onClick={() => setActiveStep(i)}
              className={cn(
                "px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px",
                activeStep === i
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {i + 1}. {step}
            </button>
          ))}
        </div>

        {/* Active step content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">{renderStep()}</div>
          <div>
            <ActivityTimeline jobId={job.id} />
          </div>
        </div>
      </div>
    </EditorLayout>
  );
};

export default JobDetail;
