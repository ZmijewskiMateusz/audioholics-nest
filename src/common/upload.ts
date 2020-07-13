import { Injectable } from '@nestjs/common';
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

@Injectable()
export class UploadService {
  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'audioholics',
      format: async (req, file) => ['png', 'jpeg'],
      public_id: (req, file) => 'test-test',
    },
  });

  parser = multer({ storage: this.storage });
}
