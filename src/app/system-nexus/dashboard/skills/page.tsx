import CrudTable from "@/components/admin/CrudTable";
import SectionHeaderEditor from "@/components/admin/SectionHeaderEditor";

export default function SkillsAdmin() {
  return (
    <div className="space-y-8 pb-10">
      <SectionHeaderEditor sectionId="skills" />
      <CrudTable 
        title="Skills" 
        endpoint="/api/collection/skills" 
        fields={[
          { name: "name", label: "Skill Name", type: "text" },
          { name: "category", label: "Category", type: "text" },
          { name: "level", label: "Proficiency Level (0-100)", type: "number" },
          { name: "icon", label: "Icon Name", type: "text" },
          { name: "description", label: "Description", type: "textarea" }
        ]} 
      />
    </div>
  );
}
