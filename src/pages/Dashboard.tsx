import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import EditorLayout from "@/components/editor/EditorLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, AlertCircle, Clock, CheckCircle, FileText } from "lucide-react";

const STATUSES = [
  "new", "processing", "brief_ready", "draft_ready", "in_review",
  "approved", "publishing", "published", "failed",
] as const;

const statusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  processing: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  brief_ready: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
  draft_ready: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  in_review: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  approved: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  publishing: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",
  published: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  failed: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
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
        .order("updated_at", { ascending: false });

      if (statusFilter) query = query.eq("status", statusFilter);
      if (search.trim()) {
        query = query.or(`title.ilike.%${search}%,guest_name.ilike.%${search}%,product_name.ilike.%${search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  // Summary counts
  const counts = {
    new: jobs?.filter((j) => j.status === "new").length || 0,
    in_review: jobs?.filter((j) => j.status === "in_review").length || 0,
    approved: jobs?.filter((j) => j.status === "approved").length || 0,
    failed: jobs?.filter((j) => j.status === "failed").length || 0,
  };

  const summaryCards = [
    { label: "New", count: counts.new, icon: FileText, status: "new", color: "text-blue-600" },
    { label: "In Review", count: counts.in_review, icon: Clock, status: "in_review", color: "text-orange-600" },
    { label: "Approved", count: counts.approved, icon: CheckCircle, status: "approved", color: "text-emerald-600" },
    { label: "Failed", count: counts.failed, icon: AlertCircle, status: "failed", color: "text-red-600" },
  ];

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

        {/* Summary cards */}
        {!isLoading && jobs && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {summaryCards.map((card) => (
              <button
                key={card.status}
                onClick={() => setStatusFilter(statusFilter === card.status ? null : card.status)}
                className={`p-4 rounded-md border bg-card text-left transition-all hover:shadow-sm ${
                  statusFilter === card.status ? "ring-2 ring-foreground/20" : ""
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <card.icon className={`h-4 w-4 ${card.color}`} />
                  <span className="text-2xl font-semibold text-foreground">{card.count}</span>
                </div>
                <p className="text-xs text-muted-foreground">{card.label}</p>
              </button>
            ))}
          </div>
        )}

        {/* Search & filters */}
        <div className="space-y-3">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title, guest, or product…"
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
              All ({jobs?.length || 0})
            </button>
            {STATUSES.map((s) => {
              const count = jobs?.filter((j) => j.status === s).length || 0;
              return (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s === statusFilter ? null : s)}
                  className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                    statusFilter === s ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {s.replace(/_/g, " ")} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Jobs list */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 rounded-md border bg-muted animate-pulse" />
            ))}
          </div>
        ) : !jobs || jobs.length === 0 ? (
          <div className="text-center py-12 border border-dashed rounded-md">
            <p className="text-muted-foreground mb-4">
              {statusFilter ? `No jobs with status "${statusFilter.replace(/_/g, " ")}"` : "No content jobs found"}
            </p>
            <Button asChild variant="outline">
              <Link to="/jobs/new">Create your first job</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-2">
            {jobs.map((job) => (
              <Link
                key={job.id}
                to={`/jobs/${job.id}`}
                className="flex items-center justify-between p-4 rounded-md border bg-card hover:shadow-sm transition-shadow group"
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <p className="font-medium text-foreground truncate group-hover:text-foreground/80 transition-colors">{job.title}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="capitalize">{job.content_type}</span>
                    {job.guest_name && <><span>·</span><span>{job.guest_name}</span></>}
                    {job.product_name && <><span>·</span><span>{job.product_name}</span></>}
                    <span>·</span>
                    <span>{new Date(job.updated_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <Badge className={`${statusColors[job.status] || ""} text-xs capitalize shrink-0 ml-3`}>
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
