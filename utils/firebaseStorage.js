const admin = require('firebase-admin');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

let appInitialized = false;

function parseServiceAccountFromEnv() {
  // Prefer a full JSON service account in FIREBASE_SERVICE_ACCOUNT
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    } catch (e) {
      throw new Error('FIREBASE_SERVICE_ACCOUNT contains invalid JSON');
    }
  }

  // If GOOGLE_APPLICATION_CREDENTIALS points to a JSON file path, try to load it
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    try {
      const p = process.env.GOOGLE_APPLICATION_CREDENTIALS;
      if (fs.existsSync(p)) {
        return require(p);
      }
    } catch (e) {
      // fall through
    }
  }

  // Fallback to individual env vars
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC5R/mvLG0Eyiyg\nx6btAdzEDufdXy00cfyQRZn4RQ0FE99jkoQaBBrloT7txHpnOU5twA5RXPaCVV1t\nIt9TSnAXBlKtW1Od2Vb9R1NcJrnR+h488TpeDhIyWdzfzGgFCJNAAgoQab8n6SB2\nM4hOo9l6/TVtFCzwkloc06GWPjTgkPb4gASj/9TUPjeksNLDdflLyyU07qBiidr0\nd5rcqzMr+BQRLS9qNZ/vlGJy1MgKBIkmanLdo7u/zcXFW3PUW8RJuFgCaoAy3QJq\n0X5Lynlv5BqQvr2jspAA72DnO6jylCqXNVVWq7rXRkF1m7eYa2W2i4HVhJ9PDzGI\ng/FIJUbFAgMBAAECggEAAYihffw5qMz9opUUgii+SZcv/yqfBqyc4RraY+46Zdzc\nwAfB9S8sg9MaYMB8HOeiCRGKbMz+s2R+gf1EaP2YQPCJ9apoXkmiyTTycTRW3HCc\nGHgMuiOWrfkFdYrNH6GLCoAZ0jn13aA15xSVH8WGctiuvQjqOFGV0mBEGajJKkS1\nU5r6pF48KXX0x8W2A+T0lnwwwxBtyTDJ8CKBIVlq0RsMk6PMurALlqbiMfooNBZ5\n5MibNTpNvUKoGlPvmwyLHvSk/6l+9cchHezNRbMXgChWGmFxYI273weFqhTkyzO5\no94jlYmeaAj8S9MGjdY4e8O2JrkC21+s2j0f0YavDwKBgQDaMvDY2evbBV+fk2UG\n//7UfZxWq5zTknEAVY1wsFigeMWbD36wNJZjxd3D7mrpNVSHnCULQxjclAw7kHVe\nK/KdnqXKv3yyUY3G+aKLP2RrlXSc4DdXAnTzwMJ80swbt7gXvlR03W9C/jcjieqh\n248fspHNP3XnXiP/r5vrgD6JCwKBgQDZYSN2p+yPEZYLkpkM1aWiHr6dz8bmPRF6\noJfuT+2CpRqOY2vJTVKomr56P1n6Fbk3cumgTwjhvHBwfveTbGkSJDkIR6Z9xAKZ\njvNl8+yvHywfrmI8ZbrutQSwW+ZKaZFah9FTxGgk9WxlB54H4cYt9Mhuxw6uUllG\nLdt9kd5xbwKBgCDT8TBu+PEmydA0WMrI0QofK9pOT3X1XlLyjCkcHvllsjU2C5Vv\nFAFGz6qewC79+w28DEa5fZASJhUAEuhsLEBSkhcC4Dvj0TTScgYJL46QGc9QXIMW\nt4nEwn4NKPAyn9vSotpCRm8J2DnckhRv+ASI1S7QEWkR3NCnFwpDbSUpAoGBAKAc\n/JIZfhSjT3GWuUTK2QVgv+ZddJOBx64bO8088iSYl8bpVCsh2RB3anWA1DVwasx8\nx7hcfp5GvkseOh1MbNf/9kIzBF7+USvqLz2ZPWx/+XAcch8qj1Xj32BHUIje2UFl\naLnaoRsX6o8/3RbRJbgT5M4zsIyV+0vF2zXSi5XhAoGBAJL7FkrTe7BR1EEkLI2d\npQK4sLbgesoD9YesTD3MrrpNvyAlyloFhLxSFHa1DJTMGcjNGfbwTiQIxo+LRZEt\nc+SD5rGHS5/KBOWrYz2bodT6k1+IAyUGi8Q9dRxURJiUhjQZYuJApJfhv+w6LzVW\nEUujYIanZRBihcNF58m5xYDh\n-----END PRIVATE KEY-----\n";
  if (privateKey) {
    // Replace escaped newlines with real newlines if needed
    privateKey = privateKey.replace(/\\n/g, '\n');
    // Private key may be provided wrapped in quotes; trim them
    if ((privateKey.startsWith('"') && privateKey.endsWith('"')) || (privateKey.startsWith("'") && privateKey.endsWith("'"))) {
      privateKey = privateKey.slice(1, -1);
    }
  }

  if (projectId && clientEmail && privateKey) {
    return {
      project_id: projectId,
      client_email: clientEmail,
      private_key: privateKey,
    };
  }

  return null;
}

function initFirebase() {
  if (appInitialized) return;

  const serviceAccount = parseServiceAccountFromEnv();
  if (!serviceAccount) {
    throw new Error('Missing Firebase credentials. Provide FIREBASE_SERVICE_ACCOUNT (JSON) or FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY');
  }

  // Ensure correct key names for firebase-admin (expects project_id, client_email, private_key)
  const certObj = serviceAccount;

  admin.initializeApp({
    credential: admin.credential.cert(certObj),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || `${certObj.project_id}.appspot.com`,
  });
  appInitialized = true;
}

async function uploadBufferToFirebase(buffer, originalName, contentType) {
  initFirebase();
  const bucket = admin.storage().bucket();
  // verify bucket exists to provide a clear error message
  try {
    const [exists] = await bucket.exists();
    if (!exists) {
      throw new Error(`Firebase storage bucket "${bucket.name}" does not exist. Create the bucket in Firebase Console or set FIREBASE_STORAGE_BUCKET to a valid bucket name.`);
    }
  } catch (err) {
    // rethrow with clearer guidance
    throw new Error(err.message || 'Failed to access Firebase storage bucket');
  }
  // Store files at bucket root using a uuid + original extension to avoid folder dependencies
const fileName = originalName || `${uuidv4()}`;
const file = bucket.file(fileName);


  const metadata = {
    metadata: {
      firebaseStorageDownloadTokens: uuidv4(),
    },
    contentType: contentType || 'application/octet-stream',
    cacheControl: 'public, max-age=31536000',
  };

  await file.save(buffer, { resumable: false, metadata });

  // Construct a public URL using token
  const token = metadata.metadata.firebaseStorageDownloadTokens;
  const bucketName = bucket.name;
  const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(file.name)}?alt=media&token=${token}`;

  return {
    name: file.name,
    url: publicUrl,
    contentType: metadata.contentType,
  };
}

module.exports = {
  uploadBufferToFirebase,
};
