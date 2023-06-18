import {
  GetObjectCommand,
  HeadObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';

const s3Client =
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

export const handler = async (options: { bucket: string; key: string }) => {
  const request = {
    Bucket: options.bucket,
    Key: options.key,
  };

  const getHeadCommand = new HeadObjectCommand(request);
  const getObjCommand = new GetObjectCommand(request);

  try {
    const metadata = await s3Client.send(getHeadCommand).then((data) => {
      return {
        contentEncoding: data.ContentEncoding,
        contentType: data.ContentType,
      };
    });

    const response = await s3Client.send(getObjCommand);
    const imgStr = await response.Body.transformToString(
      metadata.contentEncoding
    );

    return `data:${metadata.contentType};${metadata.contentEncoding},${imgStr}`;
  } catch (err) {
    console.error(err.message);
    return null;
  }
};
