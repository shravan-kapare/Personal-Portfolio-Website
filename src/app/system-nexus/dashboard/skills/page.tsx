import CrudTable from "@/components/admin/CrudTable";

export default function SkillsAdmin() {
  return (
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
  );
}
