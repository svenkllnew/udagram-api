import AWS = require('aws-sdk');
import {config} from './config/config';


// Configure AWS
const c = config;
 
//Configure AWS
if(c.aws_profile && c.aws_profile !== "DEPLOYED") {
  console.log(`Using AWS_PROFILE=${c.aws_profile}`);
  var credentials = new AWS.SharedIniFileCredentials({profile: c.aws_profile});
  AWS.config.credentials = credentials;
}
AWS.config.getCredentials((err) => {
    if (err) {
        console.error(err);
    }
    else {
        console.log(`Successfully loaded AWS credentials of type=${AWS.config.credentials.constructor.name}`)
    }
});

export const s3 = new AWS.S3({
  signatureVersion: 'v4',
  region: config.aws_region,
  params: {Bucket: config.aws_media_bucket},
});

// Generates an AWS signed URL for retrieving objects
export function getGetSignedUrl( key: string ): string {
  const signedUrlExpireSeconds = 60 * 5;

  return s3.getSignedUrl('getObject', {
    Bucket: config.aws_media_bucket,
    Key: key,
    Expires: signedUrlExpireSeconds,
  });
}

// Generates an AWS signed URL for uploading objects
export function getPutSignedUrl( key: string ): string {
  const signedUrlExpireSeconds = 60 * 5;

  return s3.getSignedUrl('putObject', {
    Bucket: config.aws_media_bucket,
    Key: key,
    Expires: signedUrlExpireSeconds,
  });
}
