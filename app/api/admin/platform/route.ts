import { NextRequest, NextResponse } from 'next/server';
import { assertAdmin, getAdminAccess } from '@/lib/adminAuth';
import {
  createInstitution,
  getFinanceSnapshot,
  getInstitutionDetail,
  getPlatformOverview,
  listConnections,
  listGovernanceQueue,
  listInstitutions,
  listPersonnel,
  provisionInstitution,
  purgeAllMongoCatalogue,
  purgeImportedCatalogue,
  reviewInstitutionApplication,
  reviewWithdrawal,
  setMembershipSuspension,
  setUserBan,
  updateInstitution,
} from '@/lib/admin/platform';

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
