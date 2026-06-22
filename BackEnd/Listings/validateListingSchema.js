
import {z} from 'zod'

export const createListingSchema= z.object({
    title  : z.string() ,  
    description : z.string(),
    price : z.coerce.number().positive().min(1), 
    address : z.string(), 
    location : z.string(),   
    category : z.string()
})