import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import About from "./pages/About";
import EditionTemplate from "./pages/EditionTemplate";
import AdminLogin from "./pages/AdminLogin";
import AdminEditionsList from "./pages/AdminEditionsList";
import AdminEditionForm from "./pages/AdminEditionForm";
import ProtectedRoute from "./components/admin/ProtectedRoute";
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
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/editions/:slug" element={<EditionTemplate />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/editions" element={<ProtectedRoute><AdminEditionsList /></ProtectedRoute>} />
            <Route path="/admin/editions/new" element={<ProtectedRoute><AdminEditionForm /></ProtectedRoute>} />
            <Route path="/admin/editions/:id/edit" element={<ProtectedRoute><AdminEditionForm /></ProtectedRoute>} />
            {/* Redirect old routes */}
            <Route path="/products" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
