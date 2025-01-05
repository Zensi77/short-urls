import mongoose from 'mongoose';

const statsSchema = new mongoose.Schema(
  {
    linkId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Link',
      required: true,
    },
    totalClicks: {
      type: Number,
      default: 0,
    },
    countries: [String], // ['USA', 'UK', 'Canada']
    browsers: [String], // ['Chrome', 'Firefox']
    devices: [String], // ['Mobile', 'Desktop']
  },
  { timestamps: true }
);

statsSchema.index({ linkId: 1, timeStamp: -1 }); // Indice compuesto por linkId y timeStamp en orden descendente

statsSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (_doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Stat = mongoose.model('Stat', statsSchema);
