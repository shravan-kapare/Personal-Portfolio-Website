import SingletonEditor from "@/components/admin/SingletonEditor";

export default function AboutAdmin() {
  return (
    <SingletonEditor 
      title="About Me" 
      endpoint="/api/singleton/about" 
      fields={[
        { name: "heading", label: "Heading", type: "text" },
        { name: "paragraphs", label: "Paragraphs", type: "list" }
      ]} 
    />
  );
}
