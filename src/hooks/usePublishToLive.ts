import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

/**
 * Shared hook to push the latest approved article + visual to the live `editions` row
 * by invoking the existing `publish-to-website` edge function.
 *
 * Also exposes the most recent "published_to_website" activity_log entry so the UI
 * can show a "Live last synced" timestamp.
 */
export function usePublishToLive(jobId: string) {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [publishing, setPublishing] = useState(false);

  const { data: lastSync } = useQuery({
    queryKey: ["last-live-sync", jobId],
    queryFn: async () => {
      const { data } = await supabase
        .from("activity_log")
        .select("created_at, details")
        .eq("job_id", jobId)
        .eq("action_type", "published_to_website")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      return data;
    },
  });

  const publish = async () => {
    setPublishing(true);
    try {
      const { data, error } = await supabase.functions.invoke("publish-to-website", {
        body: { job_id: jobId },
      });
      if (error) throw error;
      const slug = (data as any)?.slug;
      const url = slug ? `https://longevitychannel1.com/editions/${slug}` : null;
      toast({
        title: "Live site updated",
        description: url ? `View: ${url}` : "Edition synced successfully.",
      });
      qc.invalidateQueries({ queryKey: ["last-live-sync", jobId] });
      qc.invalidateQueries({ queryKey: ["activity-log", jobId] });
      qc.invalidateQueries({ queryKey: ["visual-assets", jobId] });
      qc.invalidateQueries({ queryKey: ["live-edition-for-job", jobId] });
      // Public site queries
      qc.invalidateQueries({ queryKey: ["editions-feed"] });
      if (slug) qc.invalidateQueries({ queryKey: ["edition", slug] });
    } catch (e: any) {
      toast({
        title: "Failed to update live site",
        description: e?.message || "Unknown error",
        variant: "destructive",
      });
    } finally {
      setPublishing(false);
    }
  };

  return { publish, publishing, lastSync };
}
