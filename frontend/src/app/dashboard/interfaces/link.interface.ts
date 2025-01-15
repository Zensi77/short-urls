export interface Link {
  id: string;
  name: string;
  originalUrl: string;
  shortUrl?: string;
  clicks?: number;
  description?: string;
  createdAt?: Date;
}
