import CrudTable from "@/components/admin/CrudTable";

export default function AchievementsAdmin() {
  return (
    <CrudTable 
      title="Achievements" 
      endpoint="/api/collection/achievements" 
      fields={[
        { name: "title", label: "Title", type: "text" },
        { name: "category", label: "Category", type: "text" },
        { name: "date", label: "Date (YYYY-MM-DD)", type: "text" },
        { name: "description", label: "Description", type: "textarea" }
      ]} 
    />
  );
}
