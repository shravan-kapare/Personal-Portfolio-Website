import CrudTable from "@/components/admin/CrudTable";

export default function NavigationAdmin() {
  return (
    <CrudTable 
      title="Navigation & Sections" 
      endpoint="/api/collection/sections" 
      fields={[
        { name: "name", label: "Section Name", type: "text" },
        { name: "href", label: "Anchor / ID (e.g. #my-section)", type: "text" },
        { name: "enabled", label: "Show in Menu", type: "boolean" },
        { name: "custom", label: "Is Custom Section (Not Built-in)", type: "boolean" },
        { name: "content", label: "Section Content (Markdown/HTML or paragraphs, one per line)", type: "textarea" }
      ]} 
    />
  );
}
