import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { lazy, Suspense } from "react";

import ScrollToTop from "./components/ScrollToTop";
import ScrollToSection from "./components/ScrollToSection";
import { SubscriptionProvider } from "./contexts/SubscriptionContext";
import { UsageLimitProvider } from "./contexts/UsageLimitContext";

// Lazy-loaded pages
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ResumeBuilder = lazy(() => import("./pages/ResumeBuilder"));
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
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const ResumeEditor = lazy(() => import("./pages/ResumeEditor"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const CookiePolicy = lazy(() => import("./pages/CookiePolicy"));
const Documentation = lazy(() => import("./pages/Documentation"));
const Roadmap = lazy(() => import("./pages/Roadmap"));

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

// Query Client
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <TooltipProvider>
        <SubscriptionProvider>
          <UsageLimitProvider>
            {/* Toast Notifications */}
            <Toaster />
            <Sonner />

            {/* Router */}
            <BrowserRouter>
              <ScrollToTop />
              <ScrollToSection />

              {/* Lazy Loading Boundary */}
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  {/* Marketing Pages */}
                  <Route path="/" element={<Index />} />
                  <Route path="/features" element={<Index />} />
                  <Route path="/pricing" element={<Index />} />
                  <Route path="/enterprise" element={<Index />} />
                  <Route path="/resources" element={<Index />} />

                  {/* Authentication */}
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/reset-password" element={<ResetPassword />} />

                  {/* Dashboard & Core Features */}
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/resume-builder" element={<ResumeBuilder />} />
                  <Route path="/ai-features" element={<AIFeatures />} />
                  <Route path="/analytics" element={<Analytics />} />

                  {/* Resume Editor Routes */}
                  <Route path="/editor/new" element={<ResumeEditor />} />
                  <Route path="/editor/:resumeId" element={<ResumeEditor />} />
                  <Route path="/resume-editor" element={<ResumeEditor />} />

                  {/* Audience Pages */}
                  <Route path="/for-individuals" element={<ForIndividuals />} />
                  <Route path="/for-students" element={<ForStudents />} />

                  {/* Company Pages */}
                  <Route path="/about-us" element={<AboutUs />} />
                  <Route path="/contact" element={<Contact />} />

                  {/* Legal Pages */}
                  <Route path="/terms" element={<TermsOfService />} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="/cookie-policy" element={<CookiePolicy />} />

                  {/* Resources */}
                  <Route path="/documentation" element={<Documentation />} />
                  <Route path="/roadmap" element={<Roadmap />} />

                  {/* Affiliate Program */}
                  <Route path="/affiliate-program" element={<AffiliateProgram />} />
                  <Route path="/affiliate-dashboard" element={<AffiliateDashboard />} />

                  {/* 404 - Catch All */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </UsageLimitProvider>
        </SubscriptionProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
