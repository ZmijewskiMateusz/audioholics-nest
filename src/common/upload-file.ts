import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import { extname } from 'path';

@Injectable()
export class S3UploadsService {
  public AWS_S3_BUCKET_NAME: string = process.env.AWS_S3_BUCKET_NAME;
  public s3: AWS.S3 = new AWS.S3({ apiVersion: '2006-03-01' });

  constructor() {
    AWS.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
  }

  public uploadFile(file: any): Promise<string> {
    if (!file.mimetype.match(/\/(jpg|jpeg|png|pdf)$/)) {
      return;
    }

    const params = {
      Body: file.buffer,
      Bucket: this.AWS_S3_BUCKET_NAME,
      Key: uuid(),
      ContentType: file.mimetype,
    };

    return this.s3
      .putObject(params)
      .promise()
      .then(
        data => {
          return params.Key;
        },
        err => {
          return err;
        },
      );
  }
}
