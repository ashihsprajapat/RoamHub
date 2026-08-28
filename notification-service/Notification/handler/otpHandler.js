import { sendNotificationEmail } from "../Email/emailService.js";

export const OtpHandler = async (data) => {
    return sendNotificationEmail(data);
}