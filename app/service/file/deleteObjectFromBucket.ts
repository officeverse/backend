import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from '../../utils/aws';

export const handler = async (options: { bucket: string; key: string }) => {
  const request = {
    Bucket: options.bucket,
    Key: options.key,
  };

  const command = new DeleteObjectCommand(request);

  try {
    return s3Client.send(command);
  } catch (err) {
    console.error(err.message);
    return null;
  }
};
