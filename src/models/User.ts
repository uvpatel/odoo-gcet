import { Schema, model, models, Types, Document, Model } from "mongoose";

// 👥 models/User.ts
// This file defines:
// - Employee & Admin schema
// - Role enum
// - Clerk userId mapping
// - Soft delete logic (isActive)
// - Immutable employeeId

export type UserRole = "admin" | "employee";

export interface IUser extends Document {
  clerkId: string;
  employeeId: string;
  role: UserRole;

  name: string;
  email: string;
  phone?: string;

  department?: Types.ObjectId;
  jobTitle?: string;

  salary: number; // Stored in cents or raw unit. Handling logic should verify.
  profileImage?: string;

  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    clerkId: { type: String, required: true, unique: true, index: true },
    employeeId: { type: String, required: true, unique: true, immutable: true }, // Immutable logic
    role: { type: String, enum: ["admin", "employee"], required: true, default: "employee" },

    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },

    phone: { type: String, trim: true },
    department: { type: Schema.Types.ObjectId, ref: "Department" },
    jobTitle: { type: String, trim: true },

    salary: { type: Number, default: 0, min: 0 },
    profileImage: { type: String },

    isActive: { type: Boolean, default: true, index: true }, // Soft delete
  },
  { timestamps: true }
);

// Prevent overwrite during HMR
const User = (models.User as Model<IUser>) || model<IUser>("User", UserSchema);

export default User;
