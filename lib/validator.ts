import * as z from "zod"

export const createOrganizationFromSchema = z.object({
    organizationName: z.string().min(3, 'Organization Name must be at least 3 characters'),
    description: z.string().min(3, 'Description must be at least 3 characters').max(500, 'Description must be less than 500 characters'),
    imageUrl: z.string(),
})