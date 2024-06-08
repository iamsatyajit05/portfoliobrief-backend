import mongoose, { Document, Schema } from 'mongoose';

export interface NewsDocument extends Document {
  id: number;
  title: string;
  summary: string;
  articleUrl: string;
  category: string[];
  tags: string[];
  publishTime: Date;
  imageUrl: string;
}

const newsSchema = new Schema(
  {
    title: { type: String },
    summary: { type: String },
    articleUrl: { type: String },
    category: [{ type: String }],
    tags: [{ type: String }],
    publishTime: { type: Date },
    imageUrl: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<NewsDocument>('News', newsSchema);
