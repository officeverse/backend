import { Context, S3Event, S3ObjectCreatedNotificationEvent } from 'aws-lambda';
import { handler as getFileHandler } from './getFileFromBucket';
import { handler as uploadFileHandler } from './uploadFileToBucket';
import sharp from 'sharp';

export const handler = async (event: S3Event, context: Context) => {
  console.log('functionName', context.functionName);

  console.info('Get image from bucket');
  const { name: bucketName } = event.Records[0].s3.bucket;
  const { key } = event.Records[0].s3.object;
  const imageDataUrl = await getFileHandler({
    bucket: bucketName,
    key,
  }).catch((err) => {
    console.error(err.message);
    throw err;
  });

  console.info('Resizing image');
  const originalBuf = Buffer.from(
    imageDataUrl.replace(/^data:image\/\w+;base64,/, ''),
    'base64'
  );
  const resizedBuf = await sharp(originalBuf)
    .jpeg({ quality: 80 })
    .resize({
      width: 1000,
      height: 1000,
      withoutEnlargement: true,
    })
    .toBuffer();

  console.info('Put image to bucket');
  const uploadData = {
    file: resizedBuf.toString('base64'),
    options: {
      bucket: bucketName,
      key,
      contentEncoding: 'base64',
      contentType: 'image/jpeg',
    },
  };

  return await uploadFileHandler({ body: JSON.stringify(uploadData) }).catch(
    (err) => {
      console.error(err);
      throw err;
    }
  );
};
