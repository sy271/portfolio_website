import { motion } from "framer-motion";
import ExternalLink from "lucide-react/dist/esm/icons/external-link.js";
import { IconGithub } from "./icons/BrandIcons.jsx";

const projects = [
	{
		title: "Campus EventHub",
		description: "Full-stack event platform with CRUD, JWT auth, and role-based dashboard.",
		stack: ["React", "Node.js", "PostgreSQL", "JWT"],
		github: "https://github.com/your-username/campus-eventhub",
		demo: "https://your-demo-link.com",
		image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=900&q=80",
	},
	{
		title: "AlgoVision",
		description: "Data structure and algorithm visualizer for sorting and graph traversal concepts.",
		stack: ["Svelte", "TypeScript", "D3.js"],
		github: "https://github.com/your-username/algovision",
		demo: "https://your-demo-link.com",
		image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&w=900&q=80",
	},
	{
		title: "FoodFinder API",
		description: "REST API and mobile client prototype for nearby halal food recommendations.",
		stack: ["Flutter", "Express", "MongoDB"],
		github: "https://github.com/your-username/foodfinder-api",
		demo: "https://your-demo-link.com",
		image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80",
	},
	{
		title: "Final Year Prep Tracker",
		description: "Personal planning tool to track milestones, notes, and advisor feedback.",
		stack: ["Astro", "React", "Supabase"],
		github: "https://github.com/your-username/fyp-prep-tracker",
		demo: "https://your-demo-link.com",
		image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=900&q=80",
	},
];

export default function Projects() {
	return (
		<section id="projects" className="section section-reveal">
			<div className="section-head">
				<h2 className="section-title">Projects</h2>
				<p>Selected work that demonstrates full-stack ability and product thinking.</p>
			</div>

			<div className="projects-grid">
				{projects.map((project, index) => (
					<motion.article
						key={project.title}
						className="project-card"
						initial={{ opacity: 0, y: 25 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.2 }}
						transition={{ delay: index * 0.08, duration: 0.45 }}
					>
						<img src={project.image} alt={`${project.title} mockup`} className="project-image" />
						<div className="project-body">
							<h3>{project.title}</h3>
							<p>{project.description}</p>
							<div className="tags">
								{project.stack.map((tag) => (
									<span key={tag} className="tag">
										{tag}
									</span>
								))}
							</div>
							<div className="project-links">
								<a href={project.github} target="_blank" rel="noreferrer">
									<IconGithub size={16} /> GitHub
								</a>
								<a href={project.demo} target="_blank" rel="noreferrer">
									<ExternalLink size={16} /> Live Demo
								</a>
							</div>
						</div>
					</motion.article>
				))}
			</div>
		</section>
	);
}
