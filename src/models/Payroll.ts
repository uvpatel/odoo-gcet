// models/Payroll.ts
import { Schema, model, models, Types } from "mongoose";

export interface IPayroll {
  employeeId: Types.ObjectId;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  month: string; // e.g. "Jan-2026"
}

const PayrollSchema = new Schema<IPayroll>(
  {
    employeeId: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
    basicSalary: Number,
    allowances: Number,
    deductions: Number,
    netSalary: Number,
    month: String,
  },
  { timestamps: true }
);

export default models.Payroll || model<IPayroll>("Payroll", PayrollSchema);
