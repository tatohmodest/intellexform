import crypto from 'crypto';
import { getDb } from '@/lib/repo';

export type CampusActivationInput = {
  ownerEmail: string;
  campusName: string;
  planCode: string;
  baseUrl: string;
};

export type CampusActivationResult = {
  activationUrl: string;
  recordId: string;
};

export type CampusActivationStorePayload = {
  token: string;
  ownerEmail: string;
  campusName: string;
  planCode: string;
  status: string;
};

export type CampusActivationDeps = {
  createToken?: () => string;
  storeActivation: (payload: CampusActivationStorePayload) => Promise<{ id: string }>;
  sendNotice: (payload: {
    to: string;
    subject: string;
    body: string;
    activationUrl?: string;
    campusName?: string;
    planCode?: string;
  }) => Promise<void>;
};

export async function startCampusActivation(
  input: CampusActivationInput,
  deps: CampusActivationDeps,
): Promise<CampusActivationResult> {
  const token = (deps.createToken ? deps.createToken() : crypto.randomBytes(24).toString('hex')).trim();
  const normalizedBaseUrl = input.baseUrl.replace(/\/$/, '');
  const activationUrl = `${normalizedBaseUrl}/${token}`;

  const record = await deps.storeActivation({
    token,
    ownerEmail: input.ownerEmail,
    campusName: input.campusName,
    planCode: input.planCode,
    status: 'pending',
  });

  await deps.sendNotice({
    to: input.ownerEmail,
    subject: `Your campus setup link is ready`,
    body: [
      'Hello,',
      '',
      `Your onboarding link for ${input.campusName} is ready.`,
      `Use this link to complete your campus setup: ${activationUrl}`,
      '',
      'This step finalizes registration, setup, and launch.',
    ].join('\n'),
    activationUrl,
    campusName: input.campusName,
    planCode: input.planCode,
  });

  return {
    activationUrl,
    recordId: record.id,
  };
}

export async function storeCampusActivation(payload: CampusActivationStorePayload) {
  const db = await getDb();
  await db.collection('campus_activations').createIndex({ token: 1 }, { unique: true }).catch(() => {});
  const result = await db.collection('campus_activations').insertOne({
    token: payload.token,
    ownerEmail: payload.ownerEmail,
    campusName: payload.campusName,
    planCode: payload.planCode,
    status: payload.status,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return { id: String(result.insertedId) };
}
