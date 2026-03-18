import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const ActivityTimeline = ({ jobId }: { jobId: string }) => {
  const { data: logs } = useQuery({
    queryKey: ["activity-log", jobId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("activity_log")
        .select("*")
        .eq("job_id", jobId)
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground">Activity</h3>
      {!logs || logs.length === 0 ? (
        <p className="text-xs text-muted-foreground">No activity yet.</p>
      ) : (
        <div className="space-y-2">
          {logs.map((log) => (
            <div key={log.id} className="border-l-2 border-border pl-3 py-1">
              <p className="text-xs font-medium text-foreground">{log.action_type.replace(/_/g, " ")}</p>
              {log.details && <p className="text-xs text-muted-foreground">{log.details}</p>}
              <p className="text-[0.65rem] text-muted-foreground mt-0.5">
                {new Date(log.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivityTimeline;
