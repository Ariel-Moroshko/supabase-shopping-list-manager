import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import TopNav from "@/components/TopNav";
import TopNavTitleContextProvider from "@/components/providers/TopNavTitleContextProvider";
import { ReactQueryProvider } from "@/components/providers/ReactQueryProvider";
import { headers } from "next/headers";
import { isValidLanguage } from "@/lib/dictionaries";
import { TextSizeLoader } from "@/components/TextSizeLoader";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Shopping List",
  description: "Manage your weekly shopping list",
  applicationName: "Shopping List",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#2563eb",
};

// export const runtime = "edge";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const langFromHeader = headers().get("x-pathname")?.split("/")?.[1] ?? "";
  const language = isValidLanguage(langFromHeader) ? langFromHeader : "en";
  return (
    <html lang={language} dir={language === "he" ? "rtl" : "ltr"}>
      <body className={`${inter.className} bg-slate-50`}>
        <div className="mx-auto flex min-h-dvh max-w-lg flex-col bg-white shadow-lg">
          <TextSizeLoader>
            <TopNavTitleContextProvider>
              <TopNav language={language} />
              <ReactQueryProvider>{children}</ReactQueryProvider>
            </TopNavTitleContextProvider>
          </TextSizeLoader>
        </div>
      </body>
    </html>
  );
}
