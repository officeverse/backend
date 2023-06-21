import { Context, S3Event } from 'aws-lambda';
import { handler as getFileHandler } from './getFileFromBucket';
import { handler as uploadFileHandler } from './uploadFileToBucket';
import { handler as deleteFileHandler } from './deleteObjectFromBucket';
import sharp from 'sharp';
import { S3_PREFIX_COMPRESS } from '../../utils/aws';

export const handler = async (event: S3Event, context: Context) => {
  console.log('functionName', context.functionName);

  const { name: bucketName } = event.Records[0].s3.bucket;
  const { key: prefixedKey } = event.Records[0].s3.object;
  console.info(`Get ${prefixedKey} from ${bucketName}`);

  // avoid infinite loop
  if (!prefixedKey.includes(S3_PREFIX_COMPRESS)) return;
  const originalKey = prefixedKey.replace(
    new RegExp(`^${S3_PREFIX_COMPRESS}`),
    ''
  );

  // image has not been processed
  const imageDataUrl = await getFileHandler({
    bucket: bucketName,
    key: prefixedKey,
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
      width: 800,
      height: 800,
      fit: 'outside',
    })
    .toBuffer();

  console.info(`Put image to bucket: ${originalKey} -> ${bucketName}`);
  const uploadData = {
    file: resizedBuf.toString('base64'),
    options: {
      bucket: bucketName,
      key: originalKey,
      contentEncoding: 'base64',
      contentType: 'image/jpeg',
    },
  };

  await uploadFileHandler({ body: JSON.stringify(uploadData) }).catch((err) => {
    console.error(err);
    throw err;
  });

  console.info(`Delete original from bucket: ${prefixedKey}`);
  return await deleteFileHandler({ bucket: bucketName, key: prefixedKey });
};
