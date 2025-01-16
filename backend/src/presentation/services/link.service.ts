import { CustomErrors, LinkDto, LinkEntity } from '../../domain';
import { Link, User } from '../../data';
import { envs } from '../../config/envs';
import { generateShortUrl } from '../../config/nanoid';
import { logger } from '../../config/winston';

export class LinkService {
  async getLinks(user_id: string) {
    try {
      const user = await User.find({ uid: user_id });
      let links = await Link.find({ user: user[0]._id });

      if (links.length === 0) {
        return (links = []);
      }

      const urlBase = envs.WEB_URL;
      const linksEntity = links.map((link) => {
        const linkEntity = LinkEntity.fromObject(link);
        linkEntity.shortUrl = `${urlBase}/${link.shortUrl}`;
        return linkEntity;
      });

      return linksEntity;
    } catch (error) {
      logger.error(error);
      throw CustomErrors.internalError(error.message);
    }
  }

  async getOneLink(id: string) {
    const link = await Link.findById(id);

    if (!link) {
      throw CustomErrors.notFound('Link not found');
    }

    link.shortUrl = `${envs.WEB_URL}/${link.shortUrl}`;
    return LinkEntity.fromObject(link);
  }

  async createLink(link: LinkDto) {
    try {
      console.log(link);

      const existsLink = await Link.findOne({ url: link.originalUrl });
      if (existsLink) {
        throw CustomErrors.internalError('Link already exists');
      }

      const user = await User.find({ uid: link.user });
      if (!user) {
        throw CustomErrors.notFound('User not found');
      }

      const { name, shortUrl, originalUrl, description } = link;
      const linkModel = await Link.create({
        name,
        originalUrl,
        description,
        user: user[0]._id,
        shortUrl: shortUrl ?? generateShortUrl.generate(),
      });
      linkModel.save();
      return LinkEntity.fromObject(linkModel);
    } catch (error) {
      logger.error(error);
      throw CustomErrors.internalError(error.message);
    }
  }

  async modifyLink(id: string, link: LinkDto) {
    const linkDb = await Link.findById(id);
    if (!linkDb) {
      throw CustomErrors.notFound('Link not found');
    }

    try {
      if (link.originalUrl) {
        linkDb.originalUrl = link.originalUrl;
      }
      if (link.description) {
        linkDb.description = link.description;
      }
      if (link.shortUrl) {
        linkDb.shortUrl = link.shortUrl;
      }
      await linkDb.save();
      return LinkEntity.fromObject(linkDb);
    } catch (error) {
      logger.error(error);
      throw CustomErrors.internalError(error.message);
    }
  }

  async deleteLink(id: string) {
    const link = await Link.findByIdAndDelete(id);

    if (!link) {
      throw CustomErrors.notFound('Link not found');
    }

    return LinkEntity.fromObject(link);
  }

  async validateLink(link: string) {
    const exist = await Link.findOne({ shortUrl: link });
    if (exist) {
      return true;
    }
    return false;
  }
}
