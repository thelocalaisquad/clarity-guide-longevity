import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import About from "./pages/About";
import TechnologiesHub from "./pages/TechnologiesHub";
import ProductsHub from "./pages/ProductsHub";
import UseAtHome from "./pages/UseAtHome";
import BusinessHub from "./pages/BusinessHub";
import VideosHub from "./pages/VideosHub";
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
            <Route path="/technologies" element={<TechnologiesHub />} />
            <Route path="/products" element={<UseAtHome />} />
            <Route path="/products/reviews" element={<ProductsHub />} />
            <Route path="/business" element={<BusinessHub />} />
            <Route path="/videos" element={<VideosHub />} />
            <Route path="/editions/:slug" element={<EditionTemplate />} />
            {/* Admin routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/editions" element={<ProtectedRoute><AdminEditionsList /></ProtectedRoute>} />
            <Route path="/admin/editions/new" element={<ProtectedRoute><AdminEditionForm /></ProtectedRoute>} />
            <Route path="/admin/editions/:id/edit" element={<ProtectedRoute><AdminEditionForm /></ProtectedRoute>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
