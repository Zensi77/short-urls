import { CustomErrors, LinkDto, LinkEntity } from '../../domain';
import { Link } from '../../data';
import { envs } from '../../config/envs';

export class LinkService {
  async getLinks(user_id: string) {
    let links = await Link.find({ user_id });

    if (links.length === 0) {
      return (links = []);
    }

    const urlBase = envs.WEB_URL;
    const linksEntity = links.map((link) => {
      const linkEntity = LinkEntity.fromObject(link);
      linkEntity.shortUrl = `${urlBase}${link.shortUrl}`;
    });

    return linksEntity;
  }

  async getOneLink(id: string) {
    const link = await Link.findById(id);

    if (!link) {
      throw CustomErrors.notFound('Link not found');
    }

    return LinkEntity.fromObject(link);
  }

  async createLink(link: LinkDto) {
    const existsLink = await Link.findOne({ url: link.shortUrl });
    if (existsLink) {
      throw CustomErrors.internalError('Link already exists');
    }

    try {
      const linkModel = await Link.create(link);
      linkModel.save();
      return LinkEntity.fromObject(linkModel);
    } catch (error) {
      throw CustomErrors.internalError(error.message);
    }
  }

  async modifyLink(id: string, link: LinkDto) {
    const linkDb = await Link.findById(id);
    if (!linkDb) {
      throw CustomErrors.notFound('Link not found');
    }

    try {
      if (link.url) {
        linkDb.url = link.url;
      }
      if (link.shortUrl) {
        linkDb.shortUrl = link.shortUrl;
      }
      if (link.description) {
        linkDb.description = link.description;
      }
      await linkDb.save();
      return LinkEntity.fromObject(linkDb);
    } catch (error) {
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
}
