import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

const client = new S3Client({
  endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  region: "auto",
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});

async function uploadNote(buffer, key, mimeType) {
  const command = new PutObjectCommand({
    Bucket: process.env.CLOUDFLARE_R2_NOTES_BUCKET,
    Key: key,
    Body: buffer,
    ContentType: mimeType,
  });

  await client.send(command);

  return `${process.env.CLOUDFLARE_R2_NOTES_PUBLIC_URL}/${key}`;
}

async function deleteNote(key) {
  const command = new DeleteObjectCommand({
    Bucket: process.env.CLOUDFLARE_R2_NOTES_BUCKET,
    Key: key,
  });
  await client.send(command);
}

export { uploadNote, deleteNote };
