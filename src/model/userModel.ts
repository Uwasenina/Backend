import { Schema,Document,model } from "mongoose";


export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    accessToken: string;
    userRole: string;
}
const userSchema = new Schema<IUser>({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    accessToken: { type: String, required: true },
    userRole: { type: String, enum: ['admin', 'general_user'], default: 'user' },
}, { timestamps: true });

export const User = model<IUser>('User', userSchema);