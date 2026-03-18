import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";

interface EditorAuth {
  session: Session | null | undefined;
  role: "admin" | "editor" | null;
  loading: boolean;
  profile: { email: string; full_name: string | null } | null;
}

export function useEditorAuth(): EditorAuth {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [role, setRole] = useState<"admin" | "editor" | null>(null);
  const [profile, setProfile] = useState<{ email: string; full_name: string | null } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });
    supabase.auth.getSession().then(({ data: { session: s } }) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session === undefined) return;
    if (!session) {
      setRole(null);
      setProfile(null);
      setLoading(false);
      return;
    }

    const fetchRoleAndProfile = async () => {
      const [rolesRes, profileRes] = await Promise.all([
        supabase.from("user_roles").select("role").eq("user_id", session.user.id),
        supabase.from("profiles").select("email, full_name").eq("id", session.user.id).single(),
      ]);

      if (rolesRes.data && rolesRes.data.length > 0) {
        const roles = rolesRes.data.map((r: any) => r.role);
        if (roles.includes("admin")) setRole("admin");
        else if (roles.includes("editor")) setRole("editor");
        else setRole(null);
      } else {
        setRole(null);
      }

      if (profileRes.data) {
        setProfile(profileRes.data);
      }
      setLoading(false);
    };

    fetchRoleAndProfile();
  }, [session]);

  return { session, role, loading, profile };
}
