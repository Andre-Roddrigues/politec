import { Outfit } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '../context/ThemeContext';
import { SidebarProvider } from '../context/SidebarContext';
import Navbar from '../components/Landing/Navbar/navbar';
import Footer from '../components/Landing/footer/footer';
import { Metadata } from 'next';
import { GoogleOAuthProvider } from '@react-oauth/google';
import PromocoesBanner from '../components/Landing/banner/PromocoesBanner';
import Script from 'next/script'; // ✅ Importação adicionada

const outfit = Outfit({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "POLITEC",
  // description: "Guia para preencher seu currículo na Unitec...",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <body className={`h-full text-white ${outfit.className} dark:bg-gray-900`}>
        {/* ✅ Google Analytics usando next/script */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-3YZK3D46ZS"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-3YZK3D46ZS');
            `,
          }}
        />

        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
          {/* <ThemeProvider> */}
          <div className="sticky top-0 mb-[60px] z-50 bg-white dark:bg-gray-800 shadow-md">
            <Navbar />
          </div>
          {/* <PromocoesBanner /> */}
          <SidebarProvider>{children}</SidebarProvider>
          <Footer />
          {/* </ThemeProvider> */}
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}