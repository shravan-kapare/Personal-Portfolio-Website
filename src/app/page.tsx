import ClientHome from "@/components/ClientHome";
import { readData } from "@/lib/data";

export default async function Home() {
  // Fetch data on the server side
  const aboutData = await readData("about.json").catch(() => ({}));
  const skillsData = await readData<any[]>("skills.json").catch(() => []);
  const projectsData = await readData<any[]>("projects.json").catch(() => []);
  const educationData = await readData<any[]>("education.json").catch(() => []);
  const achievementsData = await readData<any[]>("achievements.json").catch(() => []);
  const certificationsData = await readData<any[]>("certifications.json").catch(() => []);
  const sectionsData = await readData<any[]>("sections.json").catch(() => []);

  return (
    <ClientHome 
      aboutData={aboutData}
      skillsData={skillsData}
      projectsData={projectsData}
      educationData={educationData}
      achievementsData={achievementsData}
      certificationsData={certificationsData}
      sectionsData={sectionsData}
    />
  );
}
