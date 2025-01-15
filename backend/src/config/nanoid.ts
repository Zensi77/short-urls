import { customAlphabet } from 'nanoid';

export const generateShortUrl = {
  generate() {
    const nanoid = customAlphabet('1234567890abcdef', 10);
    return nanoid();
  },
};
