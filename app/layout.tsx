import { Outfit } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '../context/ThemeContext';
import { SidebarProvider } from '../context/SidebarContext';
import Navbar from '../components/Landing/Navbar/navbar';
import Footer from '../components/Landing/footer/footer';
import { Metadata } from 'next';
import { GoogleOAuthProvider } from '@react-oauth/google';
const outfit = Outfit({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "POLITEC",
  // description: "Guia para preencher seu currículo na Unitec, incluindo informações pessoais, formação acadêmica e experiências relevantes para a graduação.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
          {/* Google Analytics */}
          <script async src="https://www.googletagmanager.com/gtag/js?id=G-3YZK3D46ZS"></script>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-3YZK3D46ZS');
              `,
            }}
          />
        </head>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      <body className={`h-full text-white${outfit.className} dark:bg-gray-900`}>
        {/* <ThemeProvider> */}
          <div className="sticky top-0 mb-[60px] z-50 bg-white dark:bg-gray-800 shadow-md">
          <Navbar />
          </div>
          <SidebarProvider>{children}</SidebarProvider>
          {/* <Footer /> */}
        {/* </ThemeProvider> */}
      </body>
      </GoogleOAuthProvider>
    </html>
  );
}
