import { transport } from "../../config/NodeMailer.js";
import { loginSuccessTemplate, sender, sendNotificationEmail } from "../Email/emailService.js";

export const wellComeHandler = async (event) => {
    return sendNotificationEmail(event);
}

export const verifyEmailHandler= async(event)=>{
    console.log("data in verify email handler", event )
}



export const loginSuccessHandler = async ({ email, name }) => {
    if (!email) {
        throw new Error("Recipient email is required for welcome email");
    }

    return transport.sendMail({
        from: `RoamHub <${sender}>`,
        to: email,
        subject: "New login to your RoamHub account",
        html: loginSuccessTemplate(name)
    });
}