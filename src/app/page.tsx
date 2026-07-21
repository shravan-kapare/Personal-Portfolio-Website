import ClientHome from "@/components/ClientHome";
import { readData } from "@/lib/data";

export default async function Home() {
  // Fetch data on the server side
  const heroData = await readData("hero.json").catch(() => ({}));
  const settingsData = await readData("settings.json").catch(() => ({}));
  const aboutData = await readData("about.json").catch(() => ({}));
  const skillsData = await readData<any>("skills.json").catch(() => ({ meta: {}, items: [] }));
  const projectsData = await readData<any>("projects.json").catch(() => ({ meta: {}, items: [] }));
  const educationData = await readData<any>("education.json").catch(() => ({ meta: {}, items: [] }));
  const achievementsData = await readData<any>("achievements.json").catch(() => ({ meta: {}, items: [] }));
  const certificationsData = await readData<any>("certifications.json").catch(() => ({ meta: {}, items: [] }));
  const sectionsData = await readData<any[]>("sections.json").catch(() => []);
  const socialData = await readData<any>("social.json").catch(() => ({ meta: {}, items: [] }));
  const evolutionData = await readData<any>("evolution.json").catch(() => ({ meta: {}, timelineEntries: [] }));
  const githubData = await readData<any>("github.json").catch(() => ({ meta: {}, items: [] }));

  // Auto-calculated counters
  const projectsCount = projectsData.items?.length || 0;
  const achievementsCount = achievementsData.items?.length || 0;
  const technologiesCount = (skillsData.items || []).filter((s: any) => s.visibility !== false).length;
  const certificatesCount = certificationsData.items?.length || 0;

  return (
    <ClientHome 
      heroData={heroData}
      settingsData={settingsData}
      aboutData={aboutData}
      skillsData={skillsData}
      projectsData={projectsData}
      educationData={educationData}
      achievementsData={achievementsData}
      certificationsData={certificationsData}
      sectionsData={sectionsData}
      socialData={socialData}
      evolutionData={evolutionData}
      githubData={githubData}
      counts={{
        projects: projectsCount,
        achievements: achievementsCount,
        technologies: technologiesCount,
        certificates: certificatesCount,
      }}
    />
  );
}
