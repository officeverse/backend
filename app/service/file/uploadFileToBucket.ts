import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import type { FileUploadOptions } from './file.types';

const s3Client = new S3Client({});

export const handler = async (event: any) => {
  const parsedBody = JSON.parse(event.body);
  const { file: base64File, options } = parsedBody as {
    file: string;
    options: FileUploadOptions;
  };

  const imageBuffer = Buffer.from(base64File, 'base64');

  const command = new PutObjectCommand({
    Bucket: options.bucket,
    Key: options.key,
    Body: imageBuffer,
    ContentEncoding: options.contentEncoding,
    ContentType: options.contentType,
  });

  return s3Client
    .send(command)
    .then(() => {
      console.log('Successfully uploaded the image!');
    })
    .catch((err) => {
      throw new Error(`Error uploading data: ${err.message}`);
    });
};
