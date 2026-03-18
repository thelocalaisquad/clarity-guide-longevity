import { Navigate } from "react-router-dom";
import { useEditorAuth } from "@/hooks/useEditorAuth";

const EditorProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, role, loading } = useEditorAuth();

  if (loading || session === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Loading…
      </div>
    );
  }

  if (!session) return <Navigate to="/editor-login" replace />;
  if (!role) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        <div className="text-center space-y-2">
          <p className="text-lg font-medium text-foreground">Access Denied</p>
          <p className="text-sm">You don't have editor or admin permissions.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default EditorProtectedRoute;
