<script>
  import { onMount } from "svelte";
  import SkillBar from "./SkillBar.svelte";

  /** When true, renders inside About (no outer #skills section). */
  export let embedded = false;

  const skills = [
    { name: "JavaScript / TypeScript", value: 88 },
    { name: "Python", value: 84 },
    { name: "Java", value: 78 },
    { name: "React / Astro / Svelte", value: 86 },
    { name: "Node.js / API Development", value: 80 },
    { name: "Git / Docker / Figma", value: 76 },
  ];

  let sectionElement;
  let inView = false;

  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !inView) inView = true;
      },
      { threshold: 0.22 }
    );
    if (sectionElement) observer.observe(sectionElement);
    return () => observer.disconnect();
  });
</script>

{#if embedded}
  <div class="about-skills-root" bind:this={sectionElement}>
    <h3 class="about-skills-title">Skills</h3>
    <p class="about-skills-sub">Languages, frameworks, and tools I use to ship projects.</p>
    <div class="skills-grid skills-grid--about">
      {#each skills as skill, idx}
        <SkillBar
          name={skill.name}
          value={skill.value}
          delay={idx * 90}
          animate={inView}
        />
      {/each}
    </div>
  </div>
{:else}
  <section id="skills" class="section section-reveal" bind:this={sectionElement}>
    <div class="section-head">
      <h2 class="section-title">Skills</h2>
      <p>Languages, frameworks, and tools I use to ship projects.</p>
    </div>
    <div class="skills-grid">
      {#each skills as skill, idx}
        <SkillBar
          name={skill.name}
          value={skill.value}
          delay={idx * 90}
          animate={inView}
        />
      {/each}
    </div>
  </section>
{/if}
