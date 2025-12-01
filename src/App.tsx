import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { lazy, Suspense } from "react";
import ScrollToTop from "./components/ScrollToTop";
import ScrollToSection from "./components/ScrollToSection";

// Lazy load pages for better performance
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ResumeBuilder = lazy(() => import("./pages/ResumeBuilder"));
const JobSearch = lazy(() => import("./pages/JobSearch"));
const Templates = lazy(() => import("./pages/Templates"));
const AIFeatures = lazy(() => import("./pages/AIFeatures"));
const Analytics = lazy(() => import("./pages/Analytics"));
const AffiliateProgram = lazy(() => import("./pages/AffiliateProgram"));
const AffiliateDashboard = lazy(() => import("./pages/AffiliateDashboard"));
const ForIndividuals = lazy(() => import("./pages/ForIndividuals"));
const ForStudents = lazy(() => import("./pages/ForStudents"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const Contact = lazy(() => import("./pages/Contact"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Auth = lazy(() => import("./pages/Auth"));
const ResumeEditor = lazy(() => import("./pages/ResumeEditor"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const CookiePolicy = lazy(() => import("./pages/CookiePolicy"));
const Documentation = lazy(() => import("./pages/Documentation"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
        <ScrollToTop />
        <ScrollToSection />
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/features" element={<Index />} />
            <Route path="/pricing" element={<Index />} />
            <Route path="/enterprise" element={<Index />} />
            <Route path="/resources" element={<Index />} />
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
            <Route path="/cookie-policy" element={<CookiePolicy />} />
            <Route path="/documentation" element={<Documentation />} />
            <Route path="/affiliate-program" element={<AffiliateProgram />} />
            <Route path="/affiliate-dashboard" element={<AffiliateDashboard />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
