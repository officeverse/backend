import { S3Client } from '@aws-sdk/client-s3';

export const S3_PREFIX_COMPRESS = 'compressImage/';

export const s3Client =
  process.env.IS_OFFLINE === 'true'
    ? new S3Client({
        forcePathStyle: true,
        credentials: {
          accessKeyId: 'S3RVER', // This specific key is required when working offline
          secretAccessKey: 'S3RVER',
        },
        endpoint: 'http://localhost:4569',
      }) //  serverless-s3-local
    : new S3Client({});
