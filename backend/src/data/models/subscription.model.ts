import mongoose from 'mongoose';

export const subscriptionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    price: {
      type: Number,
      required: true,
      validate: {
        validator: function (value: number) {
          return value >= 0;
        },
        message: 'price must be a positive number',
      },
    },
    duration: {
      type: String,
      default: 'monthly',
      required: true,
      enum: ['monthly', 'yearly'],
    },
    customLinks: {
      type: Boolean,
      required: true,
      default: false,
    },
    advancedStats: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true } // Agrega createdAt y updatedAt a los documentos
);

subscriptionSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (_doc, ret) {
    ret.id = ret._id;
    delete ret.__v;
    delete ret._id;
    return ret;
  },
});

export const Subscription = mongoose.model('Subscription', subscriptionSchema);
