import AWS from 'aws-sdk';

const {
  AWS_S3_BUCKET_NAME,
  AWS_S3_BUCKET_REGION,
  AWS_S3_BUCKET_ACCESS_KEY,
  AWS_S3_BUCKET_SECRET_KEY,
} = process.env;

const s3 = new AWS.S3({
  region: AWS_S3_BUCKET_REGION,
  accessKeyId: AWS_S3_BUCKET_ACCESS_KEY,
  secretAccessKey: AWS_S3_BUCKET_SECRET_KEY,
});

const uploadFileToS3 = async (file, folder = '') => {
  const params = {
    Bucket: AWS_S3_BUCKET_NAME,
    Key: `${folder}/${file.originalname}`,
    Body: file.buffer,
  };

  const uploadResult = await s3.upload(params).promise();
  return uploadResult.Location;
};

export { uploadFileToS3 };
