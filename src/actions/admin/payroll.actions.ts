"use server";

import { connectDB } from "@/lib/db";
import Payroll from "@/models/Payroll";
import User from "@/models/User";
import { revalidatePath } from "next/cache";

export async function runPayroll(prevState: any, formData: FormData) {
    await connectDB();
    const monthVal = formData.get("month") as string;
    const yearVal = formData.get("year") as string;

    if (!monthVal || !yearVal) {
        return { success: false, message: "Invalid month or year selected." };
    }

    // Format: "YYYY-MM"
    const month = `${yearVal}-${monthVal.padStart(2, '0')}`;

    try {
        const users = await User.find({ isActive: true });

        // Check if payroll already exists for this month for any user (heuristic)
        // We check one to avoid performance hit, or just try/catch unique constraint
        const existing = await Payroll.findOne({ month });
        if (existing) {
            return { success: false, message: `Payroll for ${month} has already been initiated.` };
        }

        const payrolls = users.map(user => {
            const baseSalary = user.salary || 5000;
            const deductions = Math.floor(baseSalary * 0.1);
            const netSalary = baseSalary - deductions;

            return {
                user: user._id,
                month,
                baseSalary,
                deductions,
                netSalary
            };
        });

        if (payrolls.length > 0) {
            await Payroll.insertMany(payrolls);
        }

        revalidatePath("/admin/payroll");
        revalidatePath("/dashboard/reports");
        return { success: true, message: `Successfully ran payroll for ${users.length} employees.` };
    } catch (error: any) {
        console.error("Payroll Error:", error);
        if (error.code === 11000) {
            return { success: false, message: "Payroll already exists for some employees for this month." };
        }
        return { success: false, message: "Failed to run payroll." };
    }
}
