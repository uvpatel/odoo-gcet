// models/Employee.ts
import { Schema, model, models, Types } from "mongoose";

export interface IEmployee {
  userId: Types.ObjectId;
  fullName: string;
  phone: string;
  address: string;
  designation: string;
  department: string;
  joiningDate: Date;
  profilePicture?: string;
  documents?: string[];
}

const EmployeeSchema = new Schema<IEmployee>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    fullName: { type: String, required: true },
    phone: String,
    address: String,
    designation: String,
    department: String,
    joiningDate: Date,
    profilePicture: String,
    documents: [String],
  },
  { timestamps: true }
);

export default models.Employee || model<IEmployee>("Employee", EmployeeSchema);
