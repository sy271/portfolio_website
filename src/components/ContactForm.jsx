import { useState } from "react";
import emailjs from "@emailjs/browser";
import Mail from "lucide-react/dist/esm/icons/mail.js";
import { IconGithub, IconLinkedin } from "./icons/BrandIcons.jsx";

const initialData = { name: "", email: "", message: "" };

export default function ContactForm() {
	const [formData, setFormData] = useState(initialData);
	const [deliveryMethod, setDeliveryMethod] = useState("resend");
	const [errors, setErrors] = useState({});
	const [status, setStatus] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const validate = () => {
		const nextErrors = {};
		if (!formData.name.trim()) nextErrors.name = "Please enter your name.";
		if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
			nextErrors.email = "Please enter a valid email.";
		}
		if (formData.message.trim().length < 15) {
			nextErrors.message = "Message should be at least 15 characters.";
		}
		setErrors(nextErrors);
		return Object.keys(nextErrors).length === 0;
	};

	const onChange = (event) => {
		const { name, value } = event.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		setStatus("");
		if (!validate()) return;

		try {
			setIsSubmitting(true);

			if (deliveryMethod === "emailjs") {
				const serviceId = import.meta.env.PUBLIC_EMAILJS_SERVICE_ID;
				const templateId = import.meta.env.PUBLIC_EMAILJS_TEMPLATE_ID;
				const publicKey = import.meta.env.PUBLIC_EMAILJS_PUBLIC_KEY;

				if (!serviceId || !templateId || !publicKey) {
					throw new Error(
						"EmailJS is not configured. Set PUBLIC_EMAILJS_SERVICE_ID, PUBLIC_EMAILJS_TEMPLATE_ID, and PUBLIC_EMAILJS_PUBLIC_KEY."
					);
				}

				await emailjs.send(
					serviceId,
					templateId,
					{
						from_name: formData.name.trim(),
						reply_to: formData.email.trim(),
						message: formData.message.trim(),
					},
					{ publicKey }
				);

				setStatus("Message sent via EmailJS.");
			} else {
				const response = await fetch("/api/contact", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						name: formData.name.trim(),
						email: formData.email.trim(),
						message: formData.message.trim(),
					}),
				});
				const data = await response.json();
				if (!response.ok || !data?.ok) {
					throw new Error(data?.message || "Resend delivery failed.");
				}
				setStatus("Message sent via Resend API.");
			}

			setFormData(initialData);
		} catch (error) {
			setStatus(error instanceof Error ? error.message : "Failed to submit. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<section id="contact" className="section section-reveal">
			<div className="section-head">
				<h2 className="section-title">Contact</h2>
				<p>Open to internships, collaborations, and freelance opportunities.</p>
			</div>

			<div className="contact-grid">
				<form className="contact-form" onSubmit={handleSubmit} noValidate>
					<label>
						Delivery Method
						<select
							name="deliveryMethod"
							value={deliveryMethod}
							onChange={(event) => setDeliveryMethod(event.target.value)}
						>
							<option value="resend">Resend (Astro API)</option>
							<option value="emailjs">EmailJS (Client Only)</option>
						</select>
					</label>
					<label>
						Name
						<input name="name" value={formData.name} onChange={onChange} />
						{errors.name && <small>{errors.name}</small>}
					</label>
					<label>
						Email
						<input name="email" type="email" value={formData.email} onChange={onChange} />
						{errors.email && <small>{errors.email}</small>}
					</label>
					<label>
						Message
						<textarea name="message" rows="5" value={formData.message} onChange={onChange} />
						{errors.message && <small>{errors.message}</small>}
					</label>
					<button type="submit" className="btn btn-primary" disabled={isSubmitting}>
						{isSubmitting ? "Sending..." : "Send Message"}
					</button>
					{status && <p className="status-msg">{status}</p>}
				</form>

				<div className="contact-card">
					<a href="mailto:your.email@example.com">
						<Mail size={18} /> your.email@example.com
					</a>
					<a href="https://github.com/your-username" target="_blank" rel="noreferrer">
						<IconGithub size={18} /> github.com/your-username
					</a>
					<a href="https://linkedin.com/in/your-profile" target="_blank" rel="noreferrer">
						<IconLinkedin size={18} /> linkedin.com/in/your-profile
					</a>
					<a href="/resume.pdf" target="_blank" rel="noreferrer">
						Download Resume PDF
					</a>
				</div>
			</div>
		</section>
	);
}
