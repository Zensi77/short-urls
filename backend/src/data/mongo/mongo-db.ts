import mongoose from 'mongoose';

interface options {
  mongoUrl: string;
  dbName: string;
}

export class MongoDB {
  static async connect(options: options) {
    const { mongoUrl, dbName } = options;

    try {
      await mongoose.connect(mongoUrl, {
        dbName,
      });
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  static async disconnect() {
    await mongoose.connection.close();
  }
}
