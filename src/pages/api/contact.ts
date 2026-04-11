import type { APIRoute } from "astro";
import { Resend } from "resend";

const emailPattern = /\S+@\S+\.\S+/;

export const POST: APIRoute = async ({ request }) => {
	try {
		const contentType = request.headers.get("content-type") || "";
		if (!contentType.includes("application/json")) {
			return new Response(
				JSON.stringify({ ok: false, message: "Invalid content type. Use JSON payload." }),
				{ status: 415, headers: { "Content-Type": "application/json" } }
			);
		}

		const { name, email, message } = await request.json();
		if (
			typeof name !== "string" ||
			typeof email !== "string" ||
			typeof message !== "string" ||
			!name.trim() ||
			!emailPattern.test(email) ||
			message.trim().length < 15
		) {
			return new Response(
				JSON.stringify({ ok: false, message: "Invalid form data. Please check all fields." }),
				{ status: 400, headers: { "Content-Type": "application/json" } }
			);
		}

		const apiKey = import.meta.env.RESEND_API_KEY;
		const toEmail = import.meta.env.CONTACT_TO_EMAIL;
		const fromEmail = import.meta.env.CONTACT_FROM_EMAIL || "Portfolio Contact <onboarding@resend.dev>";

		if (!apiKey || !toEmail) {
			return new Response(
				JSON.stringify({
					ok: false,
					message: "Server email settings are missing. Set RESEND_API_KEY and CONTACT_TO_EMAIL.",
				}),
				{ status: 500, headers: { "Content-Type": "application/json" } }
			);
		}

		const resend = new Resend(apiKey);
		const emailResult = await resend.emails.send({
			from: fromEmail,
			to: [toEmail],
			replyTo: email.trim(),
			subject: `Portfolio message from ${name.trim()}`,
			text: [
				`Name: ${name.trim()}`,
				`Email: ${email.trim()}`,
				"",
				"Message:",
				message.trim(),
			].join("\n"),
		});

		if (emailResult.error) {
			return new Response(
				JSON.stringify({
					ok: false,
					message: emailResult.error.message || "Resend failed to send the email.",
				}),
				{ status: 502, headers: { "Content-Type": "application/json" } }
			);
		}

		return new Response(JSON.stringify({ ok: true, message: "Message sent successfully with Resend." }), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch {
		return new Response(
			JSON.stringify({ ok: false, message: "Unexpected server error while sending message." }),
			{ status: 500, headers: { "Content-Type": "application/json" } }
		);
	}
};
