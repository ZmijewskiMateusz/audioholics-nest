import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import * as multerS3 from 'multer-s3';
import * as AWS from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import { HttpException, HttpStatus } from '@nestjs/common';

const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;
const s3 = new AWS.S3();
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

// Multer upload options
export const multerOptions = {
  // Enable file size limits
  limits: {
    fileSize: 1024 * 1024,
  },
  // Check the mimetypes to allow for upload
  fileFilter: (req: any, file: any, cb: any) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png|pdf)$/)) {
      // Allow storage of file
      cb(null, true);
    } else {
      // Reject file
      cb(
        new HttpException(
          `Unsupported file type ${extname(file.originalname)}`,
          HttpStatus.BAD_REQUEST,
        ),
        false,
      );
    }
  },
  storage: multerS3({
    s3: s3,
    bucket: AWS_S3_BUCKET_NAME,
    acl: 'public-read',
    key: function(request, file, cb) {
      cb(null, `${Date.now().toString()} - ${file.originalname}`);
    },
  }),
};
