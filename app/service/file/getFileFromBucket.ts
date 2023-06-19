import { GetObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from '../../utils/aws';

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
