import mongoose, { Document, Schema } from 'mongoose';

export interface UserDocument extends Document {
  googleId: string;
  name: string;
  email: string;
  emailVerified: boolean;
  picture: string;
  providerId: string;
}

const userSchema = new Schema(
  {
    googleId: { type: String, required: true, unique: true }, // `sub` field from profile
    name: { type: String, required: true }, // `name` field from profile
    email: { type: String, required: true, unique: true }, // `email` field from profile
    emailVerified: { type: Boolean, required: true }, // `email_verified` field from profile
    picture: { type: String, required: true }, // `picture` field from profile
    providerId: { type: String, required: true }, // `providerId` from additionalUserInfo
  },
  { timestamps: true } // Automatically manage createdAt and updatedAt fields
);

const User = mongoose.model<UserDocument>('AppUser', userSchema);

export default User;
