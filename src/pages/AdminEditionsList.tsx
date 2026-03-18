import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminEditionsList = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: editions, isLoading, refetch } = useQuery({
    queryKey: ["admin-editions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("editions")
        .select("id, edition_number, title, slug, category, is_published, published_date")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this edition?")) return;
    const { error } = await supabase.from("editions").delete().eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else refetch();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-background p-6 md:p-12 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-2xl font-semibold text-foreground">Editions</h1>
        <div className="flex gap-2">
          <Button asChild>
            <Link to="/admin/editions/new"><Plus size={16} /> New Edition</Link>
          </Button>
          <Button variant="ghost" size="icon" onClick={handleLogout}><LogOut size={16} /></Button>
        </div>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : !editions?.length ? (
        <p className="text-muted-foreground">No editions yet. Create your first one.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {editions.map((e) => (
              <TableRow key={e.id}>
                <TableCell className="font-mono text-sm">{e.edition_number}</TableCell>
                <TableCell className="font-medium">{e.title}</TableCell>
                <TableCell>{e.category}</TableCell>
                <TableCell>
                  <Badge variant={e.is_published ? "default" : "secondary"}>
                    {e.is_published ? "Published" : "Draft"}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">{e.published_date}</TableCell>
                <TableCell className="text-right space-x-1">
                  <Button variant="ghost" size="icon" asChild>
                    <Link to={`/admin/editions/${e.id}/edit`}><Pencil size={14} /></Link>
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(e.id)}>
                    <Trash2 size={14} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default AdminEditionsList;
