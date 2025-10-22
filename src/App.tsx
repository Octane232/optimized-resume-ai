import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ResumeBuilder from "./pages/ResumeBuilder";
import JobSearch from "./pages/JobSearch";
import Templates from "./pages/Templates";
import AIFeatures from "./pages/AIFeatures";
import Analytics from "./pages/Analytics";
import ForIndividuals from "./pages/ForIndividuals";
import ForStudents from "./pages/ForStudents";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import ResumeEditor from "./pages/ResumeEditor";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/resume-builder" element={<ResumeBuilder />} />
          <Route path="/job-search" element={<JobSearch />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/ai-features" element={<AIFeatures />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/for-individuals" element={<ForIndividuals />} />
          <Route path="/for-students" element={<ForStudents />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/editor/new" element={<ResumeEditor />} />
          <Route path="/editor/:resumeId" element={<ResumeEditor />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
