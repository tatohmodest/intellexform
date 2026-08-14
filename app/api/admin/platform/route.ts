import { NextRequest, NextResponse } from 'next/server';
import { assertAdmin, getAdminAccess } from '@/lib/adminAuth';
import {
  createInstitution,
  getFinanceSnapshot,
  getInstitutionDetail,
  getIntellexInstitution,
  getPlatformCatalogPlans,
  getPlatformOverview,
  checkInstitutionDatabase,
  listConnections,
  listGovernanceQueue,
  listInstitutions,
  listPersonnel,
  patchCatalogPlan,
  provisionInstitution,
  purgeAllMongoCatalogue,
  purgeImportedCatalogue,
  reviewInstitutionApplication,
  reviewWithdrawal,
  setMembershipSuspension,
  setUserBan,
  updateInstitution,
  updateInstitutionInfrastructure,
} from '@/lib/admin/platform';
import {
  createOnboardingInvite,
  listOnboardingInvites,
} from '@/lib/admin/onboardingInvites';
import { COMMERCIAL_PLANS, type CommercialPlanId } from '@/lib/eduos/plans';
import { isValidDatabaseMode } from '@/lib/eduos/databaseModes';
import {
  sendCampusActivationNoticeEmail,
  sendInstitutionOnboardingInviteEmail,
} from '@/lib/email';
import { manageInstitutionDomain } from '@/lib/learn/institutionDomains';
import {
  startCampusActivation,
  storeCampusActivation,
} from '@/lib/admin/campusActivation';

export const dynamic = 'force-dynamic';

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

function actor(req: NextRequest) {
  const access = getAdminAccess(req);
  return access.ok ? access.email : undefined;
}

export async function GET(req: NextRequest) {
  if (!assertAdmin(req)) return unauthorized();

  const { searchParams } = new URL(req.url);
  const resource = searchParams.get('resource') || 'overview';

  try {
    switch (resource) {
      case 'overview':
        return NextResponse.json(await getPlatformOverview());
      case 'institutions': {
        const id = searchParams.get('id');
        if (id) {
          const detail = await getInstitutionDetail(id);
          if (!detail) return NextResponse.json({ error: 'Not found' }, { status: 404 });
          return NextResponse.json(detail);
        }
        return NextResponse.json(
          await listInstitutions({
            q: searchParams.get('q') || undefined,
            status: searchParams.get('status') || undefined,
          }),
        );
      }
      case 'personnel':
        return NextResponse.json(
          await listPersonnel({
            q: searchParams.get('q') || undefined,
            banned:
              searchParams.get('banned') === '1'
                ? true
                : searchParams.get('banned') === '0'
                  ? false
                  : undefined,
            role: searchParams.get('role') || undefined,
          }),
        );
      case 'finance':
        return NextResponse.json(await getFinanceSnapshot());
      case 'connections':
        return NextResponse.json(await listConnections());
      case 'governance':
        return NextResponse.json(await listGovernanceQueue());
      case 'onboarding_invites':
        return NextResponse.json({
          invites: await listOnboardingInvites(),
          plans: COMMERCIAL_PLANS,
        });
      case 'catalog_plans':
        return NextResponse.json(await getPlatformCatalogPlans());
      case 'intellex_institution': {
        const detail = await getIntellexInstitution();
        if (!detail) return NextResponse.json({ error: 'Intellex Institution not found' }, { status: 404 });
        return NextResponse.json(detail);
      }
      default:
        return NextResponse.json({ error: 'Unknown resource' }, { status: 400 });
    }
  } catch (err) {
    console.error('Admin platform GET error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal error' },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  if (!assertAdmin(req)) return unauthorized();
  const email = actor(req);

  try {
    const body = await req.json();
    const action = body.action as string;

    switch (action) {
      case 'create_institution': {
        const inst = await createInstitution({ ...body, actorEmail: email });
        return NextResponse.json(inst);
      }
      case 'update_institution': {
        if (!body.id) return NextResponse.json({ error: 'id required' }, { status: 400 });
        const inst = await updateInstitution(body.id, { ...body, actorEmail: email });
        return NextResponse.json(inst);
      }
      case 'provision_institution': {
        if (!body.id) return NextResponse.json({ error: 'id required' }, { status: 400 });
        const inst = await provisionInstitution(body.id, { actorEmail: email });
        return NextResponse.json(inst);
      }
      case 'ban_user': {
        if (!body.userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });
        const user = await setUserBan(body.userId, {
          ban: true,
          reason: body.reason,
          actorEmail: email,
        });
        return NextResponse.json(user);
      }
      case 'unban_user': {
        if (!body.userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });
        const user = await setUserBan(body.userId, { ban: false, actorEmail: email });
        return NextResponse.json(user);
      }
      case 'suspend_membership': {
        if (!body.membershipId) {
          return NextResponse.json({ error: 'membershipId required' }, { status: 400 });
        }
        const m = await setMembershipSuspension(body.membershipId, {
          suspend: Boolean(body.suspend),
          reason: body.reason,
          actorEmail: email,
        });
        return NextResponse.json(m);
      }
      case 'review_withdrawal': {
        if (!body.id || !body.decision) {
          return NextResponse.json({ error: 'id and decision required' }, { status: 400 });
        }
        const w = await reviewWithdrawal(body.id, {
          decision: body.decision,
          note: body.note,
          payoutRef: body.payoutRef,
          actorEmail: email,
        });
        return NextResponse.json(w);
      }
      case 'review_institution_application': {
        if (!body.id || !body.decision) {
          return NextResponse.json({ error: 'id and decision required' }, { status: 400 });
        }
        const result = await reviewInstitutionApplication(body.id, {
          decision: body.decision,
          reviewNotes: body.reviewNotes,
          capabilityPack: body.capabilityPack,
          actorEmail: email,
        });
        return NextResponse.json(result);
      }
      case 'purge_imported_catalogue': {
        return NextResponse.json(await purgeImportedCatalogue());
      }
      case 'purge_all_catalogue': {
        return NextResponse.json(await purgeAllMongoCatalogue());
      }
      case 'create_onboarding_invite': {
        if (!body.email || !body.plan) {
          return NextResponse.json({ error: 'email and plan required' }, { status: 400 });
        }
        const invite = await createOnboardingInvite({
          email: body.email,
          plan: body.plan as CommercialPlanId,
          allowedModules: body.allowedModules,
          note: body.note,
          actorEmail: email,
          expiresInDays: body.expiresInDays,
          contactName: body.contactName,
          organizationName: body.organizationName || body.campusName || body.name,
          organizationType: body.organizationType,
          databaseMode: isValidDatabaseMode(body.databaseMode) ? body.databaseMode : undefined,
          suggestedSubdomain: body.suggestedSubdomain,
        });
        const origin = req.nextUrl.origin;
        const inviteUrl = `${origin}/onboard/${invite.token}`;
        const planName = COMMERCIAL_PLANS[invite.plan]?.name || String(invite.plan);
        let emailSent = true;
        try {
          await sendInstitutionOnboardingInviteEmail({
            to: invite.email,
            inviteUrl,
            planName,
            note: invite.note || null,
          });
        } catch (err) {
          console.error('onboarding invite email failed:', err);
          emailSent = false;
        }

        const activation = await startCampusActivation(
          {
            ownerEmail: invite.email,
            campusName:
              body.campusName ||
              body.organizationName ||
              body.name ||
              invite.organizationName ||
              invite.email,
            planCode: invite.plan,
            baseUrl: inviteUrl,
          },
          {
            storeActivation: storeCampusActivation,
            sendNotice: async ({ to, activationUrl, campusName, planCode }) => {
              await sendCampusActivationNoticeEmail({
                to,
                activationUrl: activationUrl || inviteUrl,
                campusName:
                  campusName ||
                  body.campusName ||
                  body.organizationName ||
                  body.name ||
                  invite.email,
                planName:
                  COMMERCIAL_PLANS[planCode as CommercialPlanId]?.name ||
                  String(planCode || invite.plan),
              }).catch((err) => {
                console.error('campus activation notice email failed:', err);
                throw err;
              });
            },
          },
        );

        return NextResponse.json({
          ...invite,
          url: inviteUrl,
          emailSent,
          activation,
        });
      }
      case 'set_institution_database': {
        if (!body.id || !isValidDatabaseMode(body.databaseMode)) {
          return NextResponse.json(
            { error: 'id and valid databaseMode required' },
            { status: 400 },
          );
        }
        const health = await updateInstitutionInfrastructure({
          institutionId: body.id,
          databaseMode: body.databaseMode,
          databaseHost: body.databaseHost,
          databasePort: body.databasePort,
          databaseName: body.databaseName,
          databaseUser: body.databaseUser,
          credentialRef: body.credentialRef,
          sslRequired: body.sslRequired,
          actorEmail: email,
        });
        return NextResponse.json(health);
      }
      case 'test_institution_database': {
        if (!body.id) return NextResponse.json({ error: 'id required' }, { status: 400 });
        return NextResponse.json(await checkInstitutionDatabase(body.id, email));
      }
      case 'update_catalog_plan': {
        if (!body.code) return NextResponse.json({ error: 'code required' }, { status: 400 });
        const plan = await patchCatalogPlan(
          body.code,
          {
            priceMonthly: body.priceMonthly,
            priceYearly: body.priceYearly,
            name: body.name,
            summary: body.summary,
            features: body.features,
          },
          email,
        );
        return NextResponse.json(plan);
      }
      case 'sync_mentor_instructor_memberships': {
        const { backfillMentorInstitutionMemberships } = await import(
          '@/lib/learn/ecosystem'
        );
        const result = await backfillMentorInstitutionMemberships(Boolean(body.dryRun));
        return NextResponse.json(result);
      }
      case 'manage_institution_domain': {
        const slug = String(body.slug || '').trim();
        const domainAction = String(body.domainAction || '').trim() as
          | 'approve'
          | 'reject'
          | 'activate'
          | 'revoke'
          | 'set'
          | 'cancel_pending';
        if (!slug || !domainAction) {
          return NextResponse.json(
            { error: 'slug and domainAction required' },
            { status: 400 },
          );
        }
        const result = await manageInstitutionDomain({
          slug,
          action: domainAction,
          domain: body.domain ?? null,
          subdomain: body.subdomain ?? undefined,
          notes: body.notes ?? null,
          actorEmail: email,
        });
        if ('error' in result) {
          return NextResponse.json(result, { status: 400 });
        }
        // Prefer Prisma detail when the institution exists there.
        let detail = null;
        try {
          const { prisma } = await import('@/lib/db/prisma');
          const row = await prisma.institution.findUnique({
            where: { slug },
            select: { id: true },
          });
          if (row) detail = await getInstitutionDetail(row.id);
        } catch {
          /* ignore */
        }
        return NextResponse.json({
          ok: true,
          domain: result.domain,
          institution: detail,
        });
      }
      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }
  } catch (err) {
    console.error('Admin platform POST error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal error' },
      { status: 500 },
    );
  }
}
