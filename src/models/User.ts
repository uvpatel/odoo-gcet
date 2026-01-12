import { Schema , model , models } from 'mongoose';

export enum UserRole {
  ADMIN = "ADMIN",
  EMPLOYEE = "EMPLOYEE",
}

export interface IUser {
    employeeId: string;
  email: string;
  password: string;
  role: UserRole;
  isEmailVerified: boolean;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
      employeeId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.EMPLOYEE,
    },
    isEmailVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
)


export default models.User || model<IUser>("User", UserSchema);