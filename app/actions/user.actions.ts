"use server";

import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { getAuthUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Create User Schema
const createUserSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    role: z.enum(["admin", "employee"]),
    jobTitle: z.string().min(2, "Job title is required"),
    department: z.string().optional(),
    salary: z.coerce.number().min(0, "Salary must be positive"),
});

// Update User Schema (allow partial updates if needed, but for now full)
const updateUserSchema = createUserSchema.partial();

export async function createUser(prevState: any, formData: FormData) {
    try {
        await connectDB();
        const currentUser = await getAuthUser();

        // 1. RBAC Check
        if (!currentUser || currentUser.role !== "admin") {
            return {
                success: false,
                message: "Unauthorized: Only Admins can add employees",
            };
        }

        // 2. Parse Data
        const rawData = {
            name: formData.get("name"),
            email: formData.get("email"),
            role: formData.get("role"),
            jobTitle: formData.get("jobTitle"),
            salary: formData.get("salary"),
        };

        const validation = createUserSchema.safeParse(rawData);

        if (!validation.success) {
            return {
                success: false,
                message: "Validation Error",
                errors: validation.error.flatten().fieldErrors,
            };
        }

        const data = validation.data;

        // 3. Unique Check
        const existingUser = await User.findOne({ email: data.email });
        if (existingUser) {
            return {
                success: false,
                message: "A user with this email already exists.",
            };
        }

        // 4. Create User
        const tempClerkId = `pending_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        const employeeId = `EMP-${Math.floor(1000 + Math.random() * 9000)}`;

        await User.create({
            clerkId: tempClerkId,
            employeeId,
            name: data.name,
            email: data.email,
            role: data.role,
            jobTitle: data.jobTitle,
            salary: data.salary,
            isActive: true,
        });

        revalidatePath("/dashboard/users");

        return {
            success: true,
            message: "Employee added successfully.",
        };

    } catch (error: any) {
        console.error("Create User Error:", error);
        return {
            success: false,
            message: error.message || "Failed to create employee",
        };
    }
}

export async function updateUser(prevState: any, formData: FormData) {
    try {
        await connectDB();
        const currentUser = await getAuthUser();

        if (!currentUser || currentUser.role !== "admin") {
            return { success: false, message: "Unauthorized" };
        }

        const userId = formData.get("userId") as string;
        if (!userId) return { success: false, message: "User ID missing" };

        const rawData = {
            name: formData.get("name"),
            email: formData.get("email"),
            role: formData.get("role"),
            jobTitle: formData.get("jobTitle"),
            salary: formData.get("salary"),
        };

        const validation = updateUserSchema.safeParse(rawData);
        if (!validation.success) {
            return {
                success: false,
                message: "Validation Error",
                errors: validation.error.flatten().fieldErrors,
            };
        }

        const data = validation.data;

        await User.findByIdAndUpdate(userId, data);
        revalidatePath("/dashboard/users");

        return { success: true, message: "User updated successfully" };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export async function toggleUserStatus(userId: string) {
    try {
        await connectDB();
        const currentUser = await getAuthUser();

        if (!currentUser || currentUser.role !== "admin") {
            throw new Error("Unauthorized");
        }

        const user = await User.findById(userId);
        if (!user) throw new Error("User not found");

        user.isActive = !user.isActive;
        await user.save();

        revalidatePath("/dashboard/users");
        return { success: true, message: `User ${user.isActive ? 'activated' : 'deactivated'}` };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}
