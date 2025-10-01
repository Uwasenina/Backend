import { Document, Schema, model } from "mongoose";

export interface Contact extends Document {
    name: string;
    email: string;
    phone: string;
    message: string
};
const contactSchema = new Schema<Contact>({
    name: { type: String, required: true },
    email: { type: String, required: true},    
    phone: { type: String, required: true },
    message: { type: String, required: true }
}, {
    timestamps: true
});



export const Contact = model<Contact>("Contact", contactSchema);