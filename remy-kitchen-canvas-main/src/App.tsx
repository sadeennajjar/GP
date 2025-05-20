import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// 🔹 Pages
import Index from "./pages/Index";
import Features from "./pages/Features";
import HowItWorks from "./pages/HowItWorks";
import AboutRemy from "./pages/AboutRemy";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AuthChoice from "./pages/AuthChoice";
import RemyBot from "./pages/RemyBot";       // Optional: old bot UI
import RemyActive from "./pages/RemyBot";    // Active listening page
import RemyLoadingPage from "./pages/RemyLoading";  // ⏳ NEW: Loading page
import RemyResultPage from "./pages/KitchenResult"; // 🖼️ NEW: Final result page

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* 🔹 Public Pages */}
          <Route path="/" element={<Index />} />
          <Route path="/features" element={<Features />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/about-remy" element={<AboutRemy />} />
          <Route path="/contact" element={<Contact />} />

          {/* 🔹 Auth Pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/auth" element={<AuthChoice />} />

          {/* 🔹 Voice Bot Flow */}
          <Route path="/remy" element={<RemyBot />} />                 {/* (Legacy or optional) */}
          <Route path="/remy-active" element={<RemyActive />} />       {/* 🔴 User talks to Remy */}
          <Route path="/remy-loading" element={<RemyLoadingPage />} /> {/* ⏳ Loading & backend */}
          <Route path="/remy-result" element={<RemyResultPage />} /> {/* 🖼️ Final image page */}

          {/* 🔹 Catch-all Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
