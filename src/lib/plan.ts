import { getTenantById } from "@/services/tenantService";

export type Plan = "free" | "pro";

export async function getTenantPlan(tenantId: string): Promise<Plan> {
  const tenant = await getTenantById(tenantId);
  return tenant?.Paket === "pro" ? "pro" : "free";
}

export async function isPro(tenantId: string): Promise<boolean> {
  return (await getTenantPlan(tenantId)) === "pro";
}
