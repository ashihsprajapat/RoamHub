
import { Resend } from "resend";
import dotenv from 'dotenv'
dotenv.config()

let api= process.env.RESEND_API_KEY
console.log(api)

export const resend = new Resend(api);