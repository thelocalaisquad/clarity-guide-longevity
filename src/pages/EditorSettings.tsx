import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import EditorLayout from "@/components/editor/EditorLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2 } from "lucide-react";

const EditorSettings = () => {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [newTarget, setNewTarget] = useState({ name: "", target_type: "webhook", webhook_url: "" });

  // Auto-publish setting
  const { data: settings } = useQuery({
    queryKey: ["editor-settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("editor_settings").select("*").limit(1).single();
      if (error) throw error;
      return data;
    },
  });

  const autoPublishMutation = useMutation({
    mutationFn: async (enabled: boolean) => {
      if (!settings?.id) return;
      const { error } = await supabase.from("editor_settings").update({ auto_publish_enabled: enabled }).eq("id", settings.id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["editor-settings"] });
      toast({ title: settings?.auto_publish_enabled ? "Auto-publish disabled" : "Auto-publish enabled" });
    },
  });

  const { data: targets, isLoading } = useQuery({
    queryKey: ["publishing-targets"],
    queryFn: async () => {
      const { data, error } = await supabase.from("publishing_targets").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const addMutation = useMutation({
    mutationFn: async () => {
      if (!newTarget.name || !newTarget.webhook_url) throw new Error("Name and URL required");
      const { error } = await supabase.from("publishing_targets").insert(newTarget);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["publishing-targets"] });
      setNewTarget({ name: "", target_type: "webhook", webhook_url: "" });
      toast({ title: "Target added" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const { error } = await supabase.from("publishing_targets").update({ active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["publishing-targets"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("publishing_targets").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["publishing-targets"] });
      toast({ title: "Target removed" });
    },
  });

  return (
    <EditorLayout>
      <div className="max-w-2xl space-y-8">
        <h1 className="text-2xl font-semibold text-foreground">Settings</h1>

        {/* Auto-publish toggle */}
        <section className="space-y-3">
          <h2 className="text-lg font-medium border-b pb-2">Auto-Publish</h2>
          <div className="flex items-center justify-between p-4 border rounded-md bg-card">
            <div>
              <p className="text-sm font-medium">Publish automatically when all checks pass</p>
              <p className="text-xs text-muted-foreground">Content will be sent to all active webhook destinations as soon as brief, newsletter, article, and social are approved.</p>
            </div>
            <Switch
              checked={settings?.auto_publish_enabled ?? false}
              onCheckedChange={(checked) => autoPublishMutation.mutate(checked)}
              disabled={autoPublishMutation.isPending}
            />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-medium border-b pb-2">Webhook Destinations</h2>

          <div className="grid gap-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label>Name</Label>
                <Input value={newTarget.name} onChange={(e) => setNewTarget((t) => ({ ...t, name: e.target.value }))} placeholder="Website CMS" />
              </div>
              <div className="space-y-1">
                <Label>Type</Label>
                <select
                  value={newTarget.target_type}
                  onChange={(e) => setNewTarget((t) => ({ ...t, target_type: e.target.value }))}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="webhook">Webhook</option>
                  <option value="api">API</option>
                </select>
              </div>
              <div className="space-y-1">
                <Label>URL</Label>
                <Input value={newTarget.webhook_url} onChange={(e) => setNewTarget((t) => ({ ...t, webhook_url: e.target.value }))} placeholder="https://…" type="url" />
              </div>
            </div>
            <Button onClick={() => addMutation.mutate()} disabled={addMutation.isPending} variant="outline" size="sm" className="w-fit">
              <Plus className="mr-2 h-4 w-4" /> Add Destination
            </Button>
          </div>

          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : targets && targets.length > 0 ? (
            <div className="space-y-2">
              {targets.map((t) => (
                <div key={t.id} className="flex items-center justify-between p-3 border rounded-md bg-card">
                  <div>
                    <p className="text-sm font-medium">{t.name}</p>
                    <p className="text-xs text-muted-foreground truncate max-w-md">{t.webhook_url}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch checked={t.active} onCheckedChange={(active) => toggleMutation.mutate({ id: t.id, active })} />
                    <button onClick={() => deleteMutation.mutate(t.id)} className="text-destructive hover:text-destructive/80">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No destinations configured.</p>
          )}
        </section>
      </div>
    </EditorLayout>
  );
};

export default EditorSettings;
