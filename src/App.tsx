import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import About from "./pages/About";
import EditionTemplate from "./pages/EditionTemplate";
import EditorLogin from "./pages/EditorLogin";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import JobNew from "./pages/JobNew";
import JobDetail from "./pages/JobDetail";
import EditorSettings from "./pages/EditorSettings";
import AdminLogin from "./pages/AdminLogin";
import AdminEditionsList from "./pages/AdminEditionsList";
import AdminEditionForm from "./pages/AdminEditionForm";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import EditorProtectedRoute from "./components/editor/EditorProtectedRoute";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/editions/:slug" element={<EditionTemplate />} />
            <Route path="/editor-login" element={<EditorLogin />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Editor area */}
            <Route path="/dashboard" element={<EditorProtectedRoute><Dashboard /></EditorProtectedRoute>} />
            <Route path="/jobs/new" element={<EditorProtectedRoute><JobNew /></EditorProtectedRoute>} />
            <Route path="/jobs/:id" element={<EditorProtectedRoute><JobDetail /></EditorProtectedRoute>} />
            <Route path="/settings" element={<EditorProtectedRoute><EditorSettings /></EditorProtectedRoute>} />

            {/* Legacy admin */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/editions" element={<ProtectedRoute><AdminEditionsList /></ProtectedRoute>} />
            <Route path="/admin/editions/new" element={<ProtectedRoute><AdminEditionForm /></ProtectedRoute>} />
            <Route path="/admin/editions/:id/edit" element={<ProtectedRoute><AdminEditionForm /></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
