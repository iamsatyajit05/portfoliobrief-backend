import mongoose, { Document, Schema } from 'mongoose';

export interface StockSubscriptionDocument extends Document {
  userId: string;
  stocks: string[];
}

const stockSubscriptionSchema = new Schema(
  {
    userId: { type: String, required: true, unique: true },
    stocks: { type: [String], required: true },
  },
  { timestamps: true }
);

export default mongoose.model<StockSubscriptionDocument>('StockSubscriptions', stockSubscriptionSchema);
