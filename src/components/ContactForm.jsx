import { useState } from "react";
import Mail from "lucide-react/dist/esm/icons/mail.js";
import { IconGithub, IconLinkedin } from "./icons/BrandIcons.jsx";

const initialData = { name: "", email: "", message: "" };

export default function ContactForm() {
	const [formData, setFormData] = useState(initialData);
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
				throw new Error(data?.message || "Failed to send message.");
			}

			setStatus("Message sent successfully! I'll get back to you soon.");
			setFormData(initialData);

		} catch (error) {
			setStatus(error instanceof Error ? error.message : "Failed to submit. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<section id="contact" className="section section-reveal">
			<div className="section-head section-head--center">
				<h2 className="section-title">Get in Touch</h2>
				<p>
					I'm actively seeking internship opportunities for Septhember 2026. Feel free to
					reach out if you'd like to connect or discuss potential opportunities!
				</p>
			</div>

			<div className="contact-grid">
				<form className="contact-form" onSubmit={handleSubmit} noValidate>
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

				<div className="contact-connect">
					<h3>Connect</h3>

					<a className="connect-item" href="mailto:chenshuyan@graduate.utm.my">
						<span className="connect-item__icon">
							<Mail size={18} />
						</span>
						<span className="connect-item__text">
							{/* <small>Email</small> */}
							<strong>chenshuyan@graduate.utm.my</strong>
						</span>
					</a>

					<a
						className="connect-item"
						href="https://linkedin.com/in/chenshuyan"
						target="_blank"
						rel="noreferrer"
					>
						<span className="connect-item__icon">
							<IconLinkedin size={18} />
						</span>
						<span className="connect-item__text">
							{/* <small>LinkedIn</small> */}
							<strong>chen shu yan</strong>
						</span>
					</a>

					<a
						className="connect-item"
						href="https://github.com/sy271"
						target="_blank"
						rel="noreferrer"
					>
						<span className="connect-item__icon">
							<IconGithub size={18} />
						</span>
						<span className="connect-item__text">
							{/* <small>GitHub</small> */}
							<strong>sy271</strong>
						</span>
					</a>

					<div className="internship-pill">
						<span className="internship-pill__dot" />
						<span>Seeking Internship</span>
					</div>

					<p className="internship-note">
						Available for Summer 2026 internships in software engineering, web development,
						or related fields.
					</p>
				</div>
			</div>
		</section>
	);
}
