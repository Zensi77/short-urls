import mongoose from 'mongoose';

export const linkModel = new mongoose.Schema(
  {
    originalUrl: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    shortUrl: {
      type: String,
      required: true,
      unique: true,
    },
    clicks: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      required: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

linkModel.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (_doc, ret) {
    ret.id = ret._id;
    delete ret.__v;
    delete ret._id;
    return ret;
  },
});

export const Link = mongoose.model('Link', linkModel);
