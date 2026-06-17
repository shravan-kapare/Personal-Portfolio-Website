import CrudTable from "@/components/admin/CrudTable";

export default function EducationAdmin() {
  return (
    <CrudTable 
      title="Education" 
      endpoint="/api/collection/education" 
      fields={[
        { name: "degree", label: "Degree", type: "text" },
        { name: "institution", label: "Institution", type: "text" },
        { name: "timeline", label: "Timeline (e.g. 2022 - 2026)", type: "text" },
        { name: "coursework", label: "Relevant Coursework", type: "list" }
      ]} 
    />
  );
}
