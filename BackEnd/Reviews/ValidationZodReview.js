
import {z} from 'zod'

export const  createReviewSchema= z.object({
    rating : z.coerce.number().positive().min(0).max(5),
    comment : z.string().min(2)
})