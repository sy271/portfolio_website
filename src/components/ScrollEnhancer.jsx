import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function ScrollEnhancer() {
	useEffect(() => {
		gsap.registerPlugin(ScrollTrigger);

		const lenis = new Lenis({
			duration: 1.1,
			lerp: 0.08,
			smoothWheel: true,
		});

		const raf = (time) => {
			lenis.raf(time);
			requestAnimationFrame(raf);
		};
		requestAnimationFrame(raf);

		const sections = gsap.utils.toArray(".section-reveal");
		sections.forEach((section) => {
			const title = section.querySelector(".section-title");

			gsap.fromTo(
				section,
				{ autoAlpha: 0, y: 40 },
				{
					autoAlpha: 1,
					y: 0,
					duration: 0.7,
					ease: "power2.out",
					scrollTrigger: {
						trigger: section,
						start: "top 82%",
						toggleActions: "play none none reverse",
					},
				}
			);

			if (title) {
				ScrollTrigger.create({
					trigger: section,
					start: "top 65%",
					end: "bottom 30%",
					onEnter: () => title.classList.add("is-active"),
					onLeaveBack: () => title.classList.remove("is-active"),
				});
			}
		});

		return () => {
			lenis.destroy();
			ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
		};
	}, []);

	return null;
}
