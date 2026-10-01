import { NextRequest, NextResponse } from "next/server";

/**
 * Check if request is from authenticated tenant
 */
export function isTenantAuthenticated(request: NextRequest): boolean {
  return request.cookies.get("isLoggedIn")?.value === "true";
}

/**
 * Check if request is from admin
 */
export function isAdminAuthenticated(request: NextRequest): boolean {
  return request.cookies.get("isAdmin")?.value === "true";
}

/**
 * Get tenant_id from cookies
 */
export function getTenantId(request: NextRequest): string | null {
  return request.cookies.get("tenant_id")?.value || null;
}

/**
 * Create unauthorized response
 */
export function unauthorizedResponse(message = "Unauthorized") {
  return NextResponse.json(
    { success: false, message },
    { status: 401 }
  );
}

/**
 * Create forbidden response
 */
export function forbiddenResponse(message = "Forbidden") {
  return NextResponse.json(
    { success: false, message },
    { status: 403 }
  );
}
