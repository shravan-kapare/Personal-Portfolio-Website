import { Metadata } from "next";

export const metadata: Metadata = {
  title: "System Nexus",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function SystemNexusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
