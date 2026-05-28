import { motion } from "framer-motion";
import { useState, useRef, useLayoutEffect } from "react";
import ExternalLink from "lucide-react/dist/esm/icons/external-link.js";
import ChevronLeft from "lucide-react/dist/esm/icons/chevron-left.js";
import ChevronRight from "lucide-react/dist/esm/icons/chevron-right.js";
import { IconGithub } from "./icons/BrandIcons.jsx";

const GAP = 16;

const projects = [
	{
		id: "p1",
		index: "01",
		category: "AI",
		title: "PolicySense",
		// techLine: "Next.js, Django REST, Supabase & RAG",
		stack: [
			"Next.js",
			"React",
			"TypeScript",
			"Tailwind CSS",
			"Django REST Framework",
			"Supabase PostgreSQL",
			"Supabase Auth",
			"Supabase Storage",
			"JWT",
			"Gemini 1.5 Flash",
			"PyMuPDF",
			"all-MiniLM-L6-v2",
			"Llama (HF Inference)",
		],
		description:
			"AI-integrated family post-insurance analysis platform that centralizes policies, extracts key PDF details, detects overlap/gaps, and provides emergency claim guidance via chatbot.",
		github: "https://github.com/sy271/cicsc-insurance-monorepo",
		demo: "https://youtu.be/14KYDqM__t8",
		image:
			"https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&q=80",
	},
	{
		id: "p2",
		index: "02",
		category: "Robotics",
		title: "ROSJoyDroid",
		// techLine: "Android, ROS 2, Fast DDS & C++ JNI",
		stack: [
			"Kotlin",
			"Jetpack Compose",
			"Android SDK 34",
			"Canvas Rendering",
			"C++",
			"JNI",
			"ROS 2",
			"Fast DDS",
			"Gradle Kotlin DSL",
			"CMake",
			"Android NDK",
			"Ninja",
			"geometry_msgs Point32",
		],
		description:
			"Android-based ROS 2 robot monitoring app for Robocon that visualizes Robot 1, Robot 2, and predicted object positions in real time on a scaled game-field map.",
		github: "https://github.com/sy271/ROSJoyDroid_Monorepo",
		demo: "",
		image:
			"https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=900&q=80",
	},
	{
		id: "p3",
		index: "03",
		category: "Mobile",
		title: "PawSure App",
		// techLine: "Flutter, NestJS, PostgreSQL & TypeORM",
		stack: ["Flutter", "NestJS", "PostgreSQL", "TypeORM", "JWT"],
		description:
			"Cross-platform pet care superapp with dual-role marketplace, AI health scanning, and real-time community features.",
		github: "https://github.com/sy271/PawsureApp",
		demo: "",
		image:
			"https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=900&q=80",
	},
	{
		id: "p4",
		index: "04",
		category: "AI",
		title: "Roamie",
		// techLine: "Flutter, Firebase, Gemini API & Google Maps API",
		stack: ["Flutter", "Dart", "Firebase", "Gemini API", "Google Maps API", "OpenWeather API"],
		description:
			"AI-powered personal travel assistant that builds budget-friendly itineraries with dynamic re-planning, translation, and integrated trip tools.",
		github: "https://github.com/sy271/Roamie",
		demo: "",
		image:
			"https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&w=900&q=80",
	},
];

export default function Projects() {
	const [perView, setPerView] = useState(3);
	const [offset, setOffset] = useState(0);
	const [selectedId, setSelectedId] = useState(null);
	const viewportRef = useRef(null);
	const [vw, setVw] = useState(0);

	useLayoutEffect(() => {
		const mq = window.matchMedia("(max-width: 1024px)");
		function sync() {
			setPerView(mq.matches ? 1 : 3);
		}
		sync();
		mq.addEventListener("change", sync);
		return () => mq.removeEventListener("change", sync);
	}, []);

	useLayoutEffect(() => {
		const el = viewportRef.current;
		if (!el) return;
		const ro = new ResizeObserver(() => setVw(el.clientWidth));
		ro.observe(el);
		setVw(el.clientWidth);
		return () => ro.disconnect();
	}, []);

	const cardW = vw > 0 ? (vw - (perView - 1) * GAP) / perView : 300;
	const step = cardW + GAP;
	const maxOffset = Math.max(0, projects.length - perView);

	useLayoutEffect(() => {
		setOffset((o) => Math.min(o, maxOffset));
	}, [maxOffset]);

	function go(delta) {
		setOffset((o) => Math.max(0, Math.min(maxOffset, o + delta)));
	}

	return (
		<section id="projects" className="section section-reveal">
			<div className="section-head">
				<h2 className="section-title">Projects</h2>
				{/* <p>Three projects per view — use arrows to slide. Click a card to focus it.</p> */}
			</div>

			<div className="projects-carousel">
				<button
					type="button"
					className="projects-carousel__arrow projects-carousel__arrow--prev"
					aria-label="Previous projects"
					disabled={offset <= 0}
					onClick={() => go(-1)}
				>
					<ChevronLeft size={22} strokeWidth={2.25} />
				</button>

				<div className="projects-carousel__viewport" ref={viewportRef}>
					<motion.div
						className="projects-carousel__track"
						animate={{ x: vw ? -offset * step : 0 }}
						transition={{ type: "spring", stiffness: 280, damping: 34, mass: 0.85 }}
					>
						{projects.map((p) => (
							<motion.article
								key={p.id}
								className={`project-carousel-card ${
									selectedId === p.id ? "project-carousel-card--active" : ""
								}`}
								style={{ width: cardW, flex: "0 0 auto" }}
								whileHover={{
									boxShadow:
										"0 0 0 1px rgba(167, 139, 250, 0.55), 0 0 48px rgba(124, 58, 237, 0.35), 0 24px 50px rgba(0, 0, 0, 0.55)",
								}}
								transition={{ type: "spring", stiffness: 420, damping: 32 }}
								onClick={() =>
									setSelectedId((id) => (id === p.id ? null : p.id))
								}
							>
								<div className="project-carousel-card__glow" aria-hidden="true" />

								<div className="project-carousel-card__top">
									<span className="project-carousel-card__num">{p.index}</span>
									<span className="project-carousel-card__cat">{p.category}</span>
								</div>

								<h3 className="project-carousel-card__title">{p.title}</h3>
								<p className="project-carousel-card__desc">{p.description}</p>

								<p className="project-carousel-card__tech-heading">Technologies used</p>
								<p className="project-carousel-card__tech-line">{p.techLine}</p>
								<div className="project-carousel-card__tags">
									{p.stack.map((tag) => (
										<span key={tag} className="project-carousel-card__tag">
											{tag}
										</span>
									))}
								</div>

								<div className="project-carousel-card__preview">
									<img src={p.image} alt="" className="project-carousel-card__img" />
								</div>

								<div className="project-carousel-card__actions">
									{p.demo ? (
										<motion.a
											href={p.demo}
											target="_blank"
											rel="noreferrer"
											className="project-carousel-btn project-carousel-btn--demo"
											whileHover={{ scale: 1.05, y: -2 }}
											whileTap={{ scale: 0.97 }}
											onClick={(e) => e.stopPropagation()}
										>
											<ExternalLink size={17} strokeWidth={2.2} />
											Live Demo
										</motion.a>
									) : (
										<span
											className="project-carousel-btn project-carousel-btn--demo"
											aria-disabled="true"
											onClick={(e) => e.stopPropagation()}
										>
											<ExternalLink size={17} strokeWidth={2.2} />
											Demo Unavailable
										</span>
									)}
									<motion.a
										href={p.github}
										target="_blank"
										rel="noreferrer"
										className="project-carousel-btn project-carousel-btn--git"
										whileHover={{ scale: 1.05, y: -2 }}
										whileTap={{ scale: 0.97 }}
										onClick={(e) => e.stopPropagation()}
									>
										<IconGithub size={17} />
										GitHub
									</motion.a>
								</div>
							</motion.article>
						))}
					</motion.div>
				</div>

				<button
					type="button"
					className="projects-carousel__arrow projects-carousel__arrow--next"
					aria-label="Next projects"
					disabled={offset >= maxOffset}
					onClick={() => go(1)}
				>
					<ChevronRight size={22} strokeWidth={2.25} />
				</button>
			</div>
		</section>
	);
}
