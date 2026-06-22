
import {z} from 'zod'


export const transactioncreateSchema= z.object({
    totalAmount : z.coerce.number().positive().min(1),
    paymentType : z.string() ,
    from  : z.coerce.date(),
    to  : z.coerce.date()
})

export const transactionVerifySchma= z.object({
    razorpay_order_id  : z.string() ,
    from  : z.coerce.date() , 
    to : z.coerce.date() ,
    totalAmount  : z.coerce.number().positive().min(1) ,
    TotalNights : z.coerce.number().positive().min(1) ,
    pernightCharge  : z.coerce.number().positive().min(1)  ,
    guests: z.array(
        z.object({
        name: z.string(),
        age: z.number().positive(),
        gender : z.string()
    })
    )
})