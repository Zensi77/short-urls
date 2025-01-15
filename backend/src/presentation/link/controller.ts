import { logger } from '../../config/winston';
import { LinkDto } from '../../domain';
import { CustomErrors } from '../../domain/errors/custom.error';
import { LinkService } from '../services/link.service';
import { Request, Response } from 'express';

export class LinkController {
  constructor(private linkService: LinkService) {}

  private handleError(error: any, res: Response) {
    if (error instanceof CustomErrors) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  getLinks = (req: Request, res: Response) => {
    const { user_id } = req.body.user;

    this.linkService
      .getLinks(user_id)
      .then((links) => {
        return res.status(200).json(links);
      })
      .catch((error) => {
        this.handleError(error, res);
      });
  };

  getOneLink = (req: Request, res: Response) => {
    const { id } = req.params;
    this.linkService
      .getOneLink(id)
      .then((link) => {
        return res.status(200).json(link);
      })
      .catch((error) => {
        this.handleError(error, res);
      });
  };

  createLink = (req: Request, res: Response) => {
    const { user_id } = req.body.user;

    const [error, linkDto] = LinkDto.create({
      ...req.body,
      user: user_id,
    });
    if (error) {
      logger.error('Error creating link DTO:', error);
      return this.handleError(error, res);
    }

    this.linkService
      .createLink(linkDto)
      .then((link) => {
        return res.status(201).json(link);
      })
      .catch((error) => {
        this.handleError(error, res);
      });
  };

  modifyLink = (req: Request, res: Response) => {
    const { user_id } = req.body.user;
    const [error, linkDto] = LinkDto.create({ ...req.body, user: user_id });
    if (error) {
      console.error('Error creating link DTO:', error);
      return this.handleError(error, res);
    }

    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ error: 'Bad request', details: 'id is required' });
    }
    this.linkService
      .modifyLink(id, linkDto)
      .then((link) => {
        return res.status(200).json(link);
      })
      .catch((error) => {
        this.handleError(error, res);
      });
  };

  deleteLink = (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'Bad request' });
    }

    this.linkService
      .deleteLink(id)
      .then(() => {
        return res.status(204).send();
      })
      .catch((error) => {
        this.handleError(error, res);
      });
  };

  validateLink = (req: Request, res: Response) => {
    const { url } = req.body;
    this.linkService
      .validateLink(url)
      .then((link) => {
        console.log(link);
        return res.status(200).json(link);
      })
      .catch((error) => {
        this.handleError(error, res);
      });
  };
}
