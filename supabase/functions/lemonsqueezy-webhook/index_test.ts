import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { findMatchingSubscriptionPlan } from "../_shared/subscriptionPlanResolver.ts";

const legacyPlans = [
  { id: "free", name: "Free" },
  { id: "starter-monthly", name: "Pitchsora Pro" },
  { id: "starter-yearly", name: "Pitchsora Pro Yearly" },
  { id: "pro-monthly", name: "Pitchsora Premium" },
  { id: "pro-yearly", name: "Pitchsora Premium Yearly" },
];

Deno.test("matches legacy starter monthly plans for Lemon Squeezy starter webhooks", () => {
  const matchedPlan = findMatchingSubscriptionPlan(legacyPlans, "starter", "monthly");

  assertEquals(matchedPlan?.id, "starter-monthly");
});

Deno.test("matches legacy starter yearly plans for Lemon Squeezy starter webhooks", () => {
  const matchedPlan = findMatchingSubscriptionPlan(legacyPlans, "starter", "yearly");

  assertEquals(matchedPlan?.id, "starter-yearly");
});

Deno.test("matches legacy pro monthly plans for Lemon Squeezy pro webhooks", () => {
  const matchedPlan = findMatchingSubscriptionPlan(legacyPlans, "pro", "monthly");

  assertEquals(matchedPlan?.id, "pro-monthly");
});

Deno.test("prefers canonical plan names when they exist", () => {
  const plans = [
    { id: "canonical-starter", name: "Starter" },
    ...legacyPlans,
  ];

  const matchedPlan = findMatchingSubscriptionPlan(plans, "starter", "monthly");

  assertEquals(matchedPlan?.id, "canonical-starter");
});