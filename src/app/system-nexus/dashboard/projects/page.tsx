import CrudTable from "@/components/admin/CrudTable";
import SectionHeaderEditor from "@/components/admin/SectionHeaderEditor";

export default function ProjectsAdmin() {
  return (
    <div className="space-y-8 pb-10">
      <SectionHeaderEditor sectionId="projects" />
      <CrudTable
        title="Projects"
        endpoint="/api/collection/projects"
        fields={[
          { name: "name", label: "Project Name", type: "text" },
          { name: "category", label: "Category", type: "text", hint: "e.g. AR/XR, AI/ML, IoT, Web" },
          { name: "description", label: "Short Description", type: "textarea" },
          { name: "longDescription", label: "Long Description (Featured)", type: "textarea", hint: "Shown on featured project cards — can be more detailed" },
          { name: "technologies", label: "Technologies", type: "list" },
          { name: "featured", label: "Featured Project", type: "boolean" },
          { name: "image", label: "Project Image / Screenshot", type: "image" },
          { name: "architectureDiagram", label: "Architecture Diagram", type: "image" },
          { name: "themeColor", label: "Theme Color", type: "text", hint: "CSS color or hex e.g. #a855f7 or rgba(168,85,247,0.3)" },
          { name: "githubUrl", label: "GitHub URL", type: "text" },
          { name: "demoUrl", label: "Live Demo URL", type: "text" },
        ]}
      />
    </div>
  );
}
