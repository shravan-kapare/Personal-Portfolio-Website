import CrudTable from "@/components/admin/CrudTable";
import SectionHeaderEditor from "@/components/admin/SectionHeaderEditor";

export default function EducationAdmin() {
  return (
    <div className="space-y-8 pb-10">
      <SectionHeaderEditor sectionId="education" />
      <CrudTable 
        title="Education" 
        endpoint="/api/collection/education" 
        fields={[
          { name: "degree", label: "Degree Name", type: "text" },
          { name: "institution", label: "Institute Name", type: "text" },
          { name: "timeline", label: "Duration", type: "text" },
          { name: "cgpa", label: "CGPA / Grade", type: "text" },
          { name: "description", label: "Education Description", type: "textarea" },
          { name: "coursework", label: "Relevant Coursework", type: "list" }
        ]} 
      />
    </div>
  );
}
