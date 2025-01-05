import { Router } from 'express';
import { LinkService } from '../services/link.service';
import { LinkController } from './controller';
import { verifyFirebaseToken } from '../middlewares/verifyFirebaseToken';

export class LinkRoutes {
  static get routes() {
    const router = Router();

    const linkService = new LinkService();
    const controller = new LinkController(linkService);

    router.use(verifyFirebaseToken);

    router.get('/', controller.getLinks);
    router.get('/:id', controller.getOneLink);
    router.post('/', controller.createLink);
    router.put('/:id', controller.modifyLink);
    router.delete('/:id', controller.deleteLink);

    return router;
  }
}
