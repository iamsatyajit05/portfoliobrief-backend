

import mongoose, { Document, Schema } from 'mongoose';

export interface IStock extends Document {
  name: string;
}

const stockSchema: Schema<IStock> = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  }
});

export default  mongoose.model<IStock>('Stocks', stockSchema);
