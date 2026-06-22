
import  { z }  from 'zod'


export const userRgisterSchema= z.object({
    name:z.string().min(3, "name is required"),
    email : z.email(),
    password : z.string().min(5)
})

export const userLoginSchema= z.object({
    email : z.email(),
    password : z.string().min(5)
})

