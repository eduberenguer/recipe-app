import { ContexProvider } from "@/app/context/context";
import Layout from "@/components/Layout";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ContexProvider>
      <Layout>{children}</Layout>
    </ContexProvider>
  );
}
