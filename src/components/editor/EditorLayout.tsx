import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { EditorSidebar } from "./EditorSidebar";

interface EditorLayoutProps {
  children: ReactNode;
}

const EditorLayout = ({ children }: EditorLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <EditorSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-12 flex items-center border-b border-border bg-background px-2">
            <SidebarTrigger className="ml-2" />
          </header>
          <main className="flex-1 p-6 bg-muted/30">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default EditorLayout;
