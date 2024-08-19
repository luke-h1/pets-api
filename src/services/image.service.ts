import { Request } from 'express';
import logger from '../utils/logger';

export default class ImageService {
  async createImages(req: Request) {
    const files = req.files as Express.Multer.File[];

    if (!files) {
      logger.error('No files provided');
      return [];
    }

    // @ts-expect-error - location does not exist on Express.Multer.File - need to extend
    const imageUrls = files.map(f => f.location);

    return imageUrls;
  }
}
