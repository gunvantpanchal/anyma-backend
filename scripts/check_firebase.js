const fs = require('fs');
const path = require('path');
const { uploadBufferToFirebase } = require('../utils/firebaseStorage');
const admin = require('firebase-admin');

async function main() {
  try {
    console.log('Using FIREBASE_STORAGE_BUCKET =', process.env.FIREBASE_STORAGE_BUCKET);
    // initialize by requiring helper which calls init
    // check bucket
    const bucketName = process.env.FIREBASE_STORAGE_BUCKET;
    if (!bucketName) {
      console.error('FIREBASE_STORAGE_BUCKET not set');
      process.exit(1);
    }

    // Check bucket exists via helper's admin
    const bucket = admin.storage().bucket(bucketName);
    const [exists] = await bucket.exists();
    console.log('Bucket exists:', exists, 'name:', bucket.name);

    const samplePath = process.env.SAMPLE_UPLOAD_PATH;
    if (samplePath) {
      if (!fs.existsSync(samplePath)) {
        console.error('SAMPLE_UPLOAD_PATH not found:', samplePath);
        process.exit(1);
      }
      const buf = fs.readFileSync(samplePath);
      console.log('Uploading sample file:', samplePath);
      const result = await uploadBufferToFirebase(buf, path.basename(samplePath), 'application/octet-stream');
      console.log('Upload result:', result);
      console.log('Visit URL to verify:', result.url);
    } else {
      console.log('No SAMPLE_UPLOAD_PATH provided. Set SAMPLE_UPLOAD_PATH to test uploading a file.');
    }
  } catch (err) {
    console.error('Error checking Firebase:', err.message || err);
    process.exit(1);
  }
}

main();
