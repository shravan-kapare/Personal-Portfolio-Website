import SingletonEditor from "@/components/admin/SingletonEditor";
import SectionHeaderEditor from "@/components/admin/SectionHeaderEditor";

export default function AboutAdmin() {
  return (
    <div className="space-y-8 pb-10">
      <SectionHeaderEditor sectionId="about" />
      <SingletonEditor 
        title="About Content" 
        endpoint="/api/singleton/about" 
        fields={[
          { name: "paragraphs", label: "Paragraphs", type: "list" }
        ]} 
      />
    </div>
  );
}
