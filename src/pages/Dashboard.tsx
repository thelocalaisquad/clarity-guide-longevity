import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import EditorLayout from "@/components/editor/EditorLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search } from "lucide-react";

const STATUSES = [
  "new", "processing", "brief_ready", "draft_ready", "in_review",
  "approved", "publishing", "published", "failed",
] as const;

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

const Dashboard = () => {
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const { data: jobs, isLoading } = useQuery({
    queryKey: ["content-jobs", statusFilter, search],
    queryFn: async () => {
      let query = supabase
        .from("content_jobs")
        .select("*")
        .order("created_at", { ascending: false });

      if (statusFilter) query = query.eq("status", statusFilter);
      if (search.trim()) {
        query = query.or(`title.ilike.%${search}%,guest_name.ilike.%${search}%,product_name.ilike.%${search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  return (
    <EditorLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
          <Button asChild>
            <Link to="/jobs/new">
              <Plus className="mr-2 h-4 w-4" /> Create New Job
            </Link>
          </Button>
        </div>

        {/* Search & filters */}
        <div className="space-y-3">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search jobs…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setStatusFilter(null)}
              className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                !statusFilter ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              All
            </button>
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s === statusFilter ? null : s)}
                className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                  statusFilter === s ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {s.replace(/_/g, " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Jobs list */}
        {isLoading ? (
          <p className="text-muted-foreground text-sm">Loading…</p>
        ) : !jobs || jobs.length === 0 ? (
          <div className="text-center py-12 border border-dashed rounded-md">
            <p className="text-muted-foreground mb-4">No content jobs found</p>
            <Button asChild variant="outline">
              <Link to="/jobs/new">Create your first job</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-3">
            {jobs.map((job) => (
              <Link
                key={job.id}
                to={`/jobs/${job.id}`}
                className="flex items-center justify-between p-4 rounded-md border bg-card hover:shadow-sm transition-shadow"
              >
                <div className="space-y-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{job.title}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {job.guest_name && <span>{job.guest_name}</span>}
                    {job.product_name && <span>· {job.product_name}</span>}
                    <span>· {new Date(job.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <Badge className={`${statusColors[job.status] || ""} text-xs capitalize shrink-0`}>
                  {job.status.replace(/_/g, " ")}
                </Badge>
              </Link>
            ))}
          </div>
        )}
      </div>
    </EditorLayout>
  );
};

export default Dashboard;
