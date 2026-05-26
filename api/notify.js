/* api/notify.js  —  Vercel Serverless Function
   Receives a push notification request from the app and fans it out to the
   FCM tokens stored under each requested role in Firestore.

   Environment variables required (set in Vercel Dashboard → Settings → Environment):
     FIREBASE_SERVICE_ACCOUNT  — the full service-account JSON (one line, stringified)

   POST body: { recipientRoles: string[], title: string, body: string }
*/

import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getMessaging } from 'firebase-admin/messaging';

function initAdmin() {
  if (getApps().length > 0) return;
  const sa = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');
  initializeApp({ credential: cert(sa) });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { recipientRoles, title, body } = req.body || {};
  if (!recipientRoles?.length || !title) {
    return res.status(400).json({ error: 'Missing recipientRoles or title' });
  }

  try {
    initAdmin();
    const db = getFirestore();
    const tokensDoc = await db.collection('fcm').doc('tokens').get();
    const tokensData = tokensDoc.exists ? tokensDoc.data() : {};

    // Collect all tokens for the requested roles
    const tokens = [];
    for (const role of recipientRoles) {
      const roleTokens = tokensData[role];
      if (Array.isArray(roleTokens)) tokens.push(...roleTokens);
    }

    if (!tokens.length) {
      return res.status(200).json({ sent: 0, message: 'No tokens registered for these roles' });
    }

    // Remove duplicates
    const unique = [...new Set(tokens)];

    const response = await getMessaging().sendEachForMulticast({
      tokens: unique,
      notification: { title, body },
      webpush: {
        notification: {
          title, body,
          icon: '/icon.svg',
          badge: '/icon.svg'
        },
        fcmOptions: { link: '/' }
      }
    });

    // Clean up expired/invalid tokens from Firestore
    const staleTokens = [];
    response.responses.forEach((r, i) => {
      if (!r.success && (r.error?.code === 'messaging/registration-token-not-registered' ||
                         r.error?.code === 'messaging/invalid-registration-token')) {
        staleTokens.push(unique[i]);
      }
    });
    if (staleTokens.length) {
      const { FieldValue } = await import('firebase-admin/firestore');
      const batch = db.batch();
      const ref = db.collection('fcm').doc('tokens');
      for (const role of recipientRoles) {
        batch.update(ref, { [role]: FieldValue.arrayRemove(...staleTokens) });
      }
      await batch.commit().catch(() => {});
    }

    return res.status(200).json({
      sent: response.successCount,
      failed: response.failureCount
    });

  } catch (err) {
    console.error('notify error', err);
    return res.status(500).json({ error: err.message });
  }
}
