import ClientHome from "@/components/ClientHome";
import { readData } from "@/lib/data";

export default async function Home() {
  // Fetch data on the server side
  const heroData = await readData("hero.json").catch(() => ({}));
  const settingsData = await readData("settings.json").catch(() => ({}));
  const aboutData = await readData("about.json").catch(() => ({}));
  const skillsData = await readData<any[]>("skills.json").catch(() => []);
  const projectsData = await readData<any[]>("projects.json").catch(() => []);
  const educationData = await readData<any[]>("education.json").catch(() => []);
  const achievementsData = await readData<any[]>("achievements.json").catch(() => []);
  const certificationsData = await readData<any[]>("certifications.json").catch(() => []);
  const sectionsData = await readData<any[]>("sections.json").catch(() => []);
  const socialData = await readData<any[]>("social.json").catch(() => []);
  const evolutionData = await readData("evolution.json").catch(() => ({}));

  // Auto-calculated counters
  const projectsCount = projectsData.length;
  const achievementsCount = achievementsData.length;
  const technologiesCount = skillsData.filter((s: any) => s.visibility !== false).length;

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
      counts={{
        projects: projectsCount,
        achievements: achievementsCount,
        technologies: technologiesCount,
      }}
    />
  );
}
