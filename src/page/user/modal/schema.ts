import * as z from 'zod';
export const userSchema = z.object({
    name: z.string().min(1, 'Full Name is required'),
    email: z.string().email('Invalid email address'),
    role: z.enum(['Admin', 'User', 'Manager']),
    status: z.enum(['Active', 'Inactive', 'Pending']),
    bio: z.string().optional(),
});

export type UserFormData = z.infer<typeof userSchema>;