export type BillingCycle = "monthly" | "yearly";

export interface SubscriptionPlanRecord {
  id: string;
  name: string | null;
}

type SupportedPlan = "starter" | "pro";

interface PlanDefinition {
  canonicalName: string;
  aliases: Record<BillingCycle, string[]>;
}

const PLAN_DEFINITIONS: Record<SupportedPlan, PlanDefinition> = {
  starter: {
    canonicalName: "Starter",
    aliases: {
      monthly: ["Vaylance Starter", "Pitchsora Starter", "Vaylance Pro", "Pitchsora Pro"],
      yearly: [
        "Starter Yearly",
        "Vaylance Starter Yearly",
        "Pitchsora Starter Yearly",
        "Vaylance Pro Yearly",
        "Pitchsora Pro Yearly",
      ],
    },
  },
  pro: {
    canonicalName: "Pro",
    aliases: {
      monthly: ["Vaylance Premium", "Pitchsora Premium", "Premium"],
      yearly: ["Pro Yearly", "Vaylance Premium Yearly", "Pitchsora Premium Yearly", "Premium Yearly"],
    },
  },
};

export function normalizePlanLabel(value: string | null | undefined): string {
  return (value ?? "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

export function toSupportedPlan(planName: string): SupportedPlan | null {
  const normalized = normalizePlanLabel(planName);

  if (["starter", "vaylancestarter", "pitchsorastarter", "vaylancepro", "pitchsorapro"].includes(normalized)) {
    return "starter";
  }

  if (["pro", "premium", "vaylancepremium", "pitchsorapremium"].includes(normalized)) {
    return "pro";
  }

  return null;
}

export function buildPlanLookupCandidates(planName: string, billingCycle?: string | null): string[] {
  const planKey = toSupportedPlan(planName);

  if (!planKey) {
    return [planName];
  }

  const cycle: BillingCycle = billingCycle === "yearly" ? "yearly" : "monthly";
  const fallbackCycle: BillingCycle = cycle === "yearly" ? "monthly" : "yearly";
  const definition = PLAN_DEFINITIONS[planKey];

  return [
    definition.canonicalName,
    ...definition.aliases[cycle],
    ...definition.aliases[fallbackCycle],
  ];
}

export function findMatchingSubscriptionPlan(
  plans: SubscriptionPlanRecord[],
  planName: string,
  billingCycle?: string | null,
): SubscriptionPlanRecord | null {
  const normalizedCandidates = buildPlanLookupCandidates(planName, billingCycle).map(normalizePlanLabel);

  for (const candidate of normalizedCandidates) {
    const matchedPlan = plans.find((plan) => normalizePlanLabel(plan.name) === candidate);

    if (matchedPlan) {
      return matchedPlan;
    }
  }

  return null;
}