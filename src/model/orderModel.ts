import mongoose, { Schema, Document } from "mongoose";

interface OrderItem {
  productId: mongoose.Types.ObjectId;
  quantity: number;
}

export interface IOrder extends Document {
  items: OrderItem[];
  totalPrice: number;
  createdAt: Date;
}
const orderSchema: Schema = new Schema(
  {
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
    totalPrice: { type: Number, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const Order = mongoose.model<IOrder>("Order", orderSchema);

export default Order;
