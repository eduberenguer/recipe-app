import { ContexProvider } from "./context/context";
import Layout from "@/components/Layout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ContexProvider>
          <Layout>{children}</Layout>
        </ContexProvider>
      </body>
    </html>
  );
}
