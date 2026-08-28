import { transport } from "../../config/NodeMailer.js";

export const sender = process.env.NodeMail;

const escapeHtml = (value) => String(value)
	.replaceAll("&", "&amp;")
	.replaceAll("<", "&lt;")
	.replaceAll(">", "&gt;")
	.replaceAll('"', "&quot;")
	.replaceAll("'", "&#039;");

const emailLayout = (title, content) => `
	<div style="margin:0;padding:24px;background:#f5f7fb;font-family:Arial,sans-serif;color:#1f2937">
		<div style="max-width:520px;margin:auto;background:#ffffff;border-radius:10px;overflow:hidden">
			<div style="padding:22px;background:#ff385c;color:#ffffff;text-align:center">
				<h1 style="margin:0;font-size:24px">RoamHub</h1>
				<p style="margin:8px 0 0">${escapeHtml(title)}</p>
			</div>
			<div style="padding:28px;text-align:center">${content}</div>
			<div style="padding:16px;background:#f9fafb;color:#6b7280;text-align:center;font-size:12px">
				If you did not request this email, you can safely ignore it.
			</div>
		</div>
	</div>
`;

const otpTemplate = (otp) => emailLayout(
	"Verify your email address",
	`<p>Use this one-time password to continue:</p>
	 <div style="margin:24px 0;padding:16px;background:#fff1f2;color:#ff385c;font-size:30px;font-weight:bold;letter-spacing:8px;border-radius:8px">
		${escapeHtml(otp)}
	 </div>
	 <p style="font-size:13px;color:#6b7280">This code expires in 3 minutes. Do not share it with anyone.</p>`
);

const welcomeTemplate = (name = "there") => emailLayout(
	"Welcome to RoamHub",
	`<h2 style="margin-top:0">Welcome, ${escapeHtml(name)}!</h2>
	 <p>Your account has been created successfully. You can now discover stays and plan your next trip.</p>`
);

export const sendNotificationEmail = async ({ email, type, otp, name }) => {
	if (!email) {
		throw new Error(`Recipient email is required for ${type}`);
	}

	const isOtp = type === "SEND_OTP";
	const subject = isOtp ? "Your RoamHub verification code" : "Welcome to RoamHub";
	const html = isOtp ? otpTemplate(otp) : welcomeTemplate(name);

	return transport.sendMail({
		from: `RoamHub <${sender}>`,
		to: email,
		subject,
		html
	});
};


export const loginSuccessTemplate = (name = "there") => emailLayout(
	"New login to your account",
	`<h2 style="margin-top:0">Welcome back, ${escapeHtml(name)}!</h2>
	 <p>You have successfully logged in to your RoamHub account.</p>
	 <p style="font-size:13px;color:#6b7280">If this was not you, please reset your password and contact support immediately.</p>`
);
