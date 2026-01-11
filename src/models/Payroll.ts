import { model, models, Schema, Types } from "mongoose";

export interface IPayroll {
  user: Types.ObjectId;
  month: string;

  baseSalary: number;
  deductions: number;
  netSalary: number;
}

const PayrollSchema = new Schema<IPayroll>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    month: { type: String, required: true },

    baseSalary: Number,
    deductions: Number,
    netSalary: Number,
  },
  { timestamps: true }
);

PayrollSchema.index({ user: 1, month: 1 }, { unique: true });

export default models.Payroll || model<IPayroll>("Payroll", PayrollSchema);
