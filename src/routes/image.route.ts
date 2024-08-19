import { Express } from 'express';
import multer from 'multer';
import multers3 from 'multer-s3';
import ImageController from '../controllers/image.controller';
import isAuth from '../middleware/isAuth';
import { s3Client } from '../utils/upload';

const upload = multer({
  storage: multers3({
    s3: s3Client,
    bucket: process.env.S3_ASSETS_BUCKET,
    acl: 'public-read',
    key(req, file, cb) {
      cb(null, `${Date.now().toString()}-${file.originalname}`);
    },
  }),
});

export default class ImageRoutes {
  private readonly app: Express;

  private readonly imageController: ImageController;

  constructor(app: Express) {
    this.app = app;
    this.imageController = new ImageController();
  }

  public initRoutes(): void {
    this.app.post(
      '/api/images',
      isAuth(),
      upload.array('images', 5),
      (req, res) => {
        return this.imageController.createImages(req, res);
      },
    );
  }
}
