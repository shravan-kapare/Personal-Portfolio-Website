import CrudTable from "@/components/admin/CrudTable";

export default function CertificationsAdmin() {
  return (
    <CrudTable 
      title="Certifications" 
      endpoint="/api/collection/certifications" 
      fields={[
        { name: "name", label: "Certificate Name", type: "text" },
        { name: "organization", label: "Issuing Organization", type: "text" },
        { name: "date", label: "Date", type: "text" },
        { name: "credentialUrl", label: "Credential URL", type: "text" },
        { name: "imageUrl", label: "Certificate Image URL", type: "text" }
      ]} 
    />
  );
}
