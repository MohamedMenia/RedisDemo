import {z} from "zod"

export const ReviewSchema= z.object({
    review:z.string().min(1),
    rating: z.number().min(1).max(5),
})

export type TReviewSchema= z.infer<typeof ReviewSchema>