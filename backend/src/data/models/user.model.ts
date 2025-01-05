import mongoose, { Schema } from 'mongoose';

export const userSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  email_verified: {
    type: Boolean,
    required: true,
    default: false,
  },
  role: {
    type: String,
    required: true,
    default: 'user',
    enum: ['user', 'admin'],
  },
  sign_in_provider: {
    type: String,
    required: true,
  },
  subscription: {
    type: Schema.Types.ObjectId,
    ref: 'Subscription',
    required: function () {
      return this.plan !== 'free'; // Only required if the user is not on the free plan
    },
  },
});

// Agrega createdAt y updatedAt a los documentos y elimina el campo __v de los documentos
// Tambien elimina el campo _id y lo reemplaza por id en el objeto retornado
userSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (_doc, ret) {
    ret.id = ret._id;
    delete ret.__v;
    delete ret._id;
    delete ret.uid;
    return ret;
  },
});

export const User = mongoose.model('User', userSchema);
