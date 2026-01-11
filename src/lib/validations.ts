import { z } from "zod";

export const roleSchema = z.enum(["admin", "employee"]);

export const userSchema = z.object({
    clerkId: z.string().min(1),
    email: z.string().email(),
    name: z.string().min(1),
    role: roleSchema,
    image: z.string().optional(),
});

export const checkInSchema = z.object({
    latitude: z.number().optional(),
    longitude: z.number().optional(),
});

export const leaveRequestSchema = z.object({
    type: z.enum(["Paid", "Sick", "Unpaid"]),
    from: z.string().datetime(), // ISO date string
    to: z.string().datetime(),
    reason: z.string().min(5),
});

export const leaveStatusSchema = z.object({
    status: z.enum(["Approved", "Rejected"]),
    adminComment: z.string().optional(),
});
