import CrudTable from "@/components/admin/CrudTable";
import SectionHeaderEditor from "@/components/admin/SectionHeaderEditor";

export default function AchievementsAdmin() {
  return (
    <div className="space-y-8 pb-10">
      <SectionHeaderEditor sectionId="achievements" />
      <CrudTable 
        title="Achievements" 
        endpoint="/api/collection/achievements" 
        fields={[
          { name: "title", label: "Achievement Title", type: "text" },
          { name: "category", label: "Category", type: "text" },
          { name: "date", label: "Date (YYYY-MM-DD)", type: "text" },
          { name: "description", label: "Achievement Description", type: "textarea" }
        ]} 
      />
    </div>
  );
}
