"use client";

// components/sections/Footer.tsx
import Link from "next/link";
import Image from "next/image";
import { useRef, type SVGProps } from "react";
import { Mail, MapPin, Phone, Send, ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";

// Imagens de pagamento (ajusta os caminhos se necessário)
import mpesaLogo from "../../../public/images/payments/mpesalogo.png";
import visaLogo from "../../../public/images/payments/visalogo.png";
import masterCardLogo from "../../../public/images/payments/masterCardIcon.png";
import emola from "../../../public/images/payments/emolalogo.png";
import UnitecFooterNew from "../../../public/images/unitecfooter.png";
import Politecfooter from "../../../public/images/heropolitec.png";
import PrivacyPolicyModal from "./politicadeprovacidade";

// ---------------------------------------------------------------------------
// Ícones de redes sociais (SVG inline)
// ---------------------------------------------------------------------------

function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.412c0-3.02 1.792-4.688 4.533-4.688 1.312 0 2.686.235 2.686.235v2.972H15.83c-1.491 0-1.956.93-1.956 1.885v2.257h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073Z" />
    </svg>
  );
}

function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069ZM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0Zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881Z" />
    </svg>
  );
}

function LinkedInIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125ZM7.119 20.452H3.554V9h3.565v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0Z" />
    </svg>
  );
}

function TikTokIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  );
}

function YouTubeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814ZM9.545 15.568V8.432L15.818 12l-6.273 3.568Z" />
    </svg>
  );
}

// Ícone WhatsApp (usado no footer antigo)
function WhatsAppIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 .5C5.648.5.5 5.648.5 12c0 2.1.549 4.152 1.588 5.963L.542 23.5l5.722-1.497A11.46 11.46 0 0 0 12 23.5c6.352 0 11.5-5.148 11.5-11.5S18.352.5 12 .5Zm0 20.418c-1.883 0-3.721-.5-5.325-1.448l-.38-.225-3.397.889.905-3.307-.248-.394A9.462 9.462 0 0 1 2.542 12c0-5.206 4.252-9.458 9.458-9.458 5.205 0 9.458 4.252 9.458 9.458 0 5.205-4.253 9.458-9.458 9.458Zm5.184-7.065c-.283-.142-1.676-.828-1.936-.923-.26-.095-.449-.142-.638.142s-.732.923-.896 1.111c-.165.189-.331.213-.614.071-.283-.142-1.195-.44-2.275-1.402-.84-.749-1.407-1.672-1.572-1.955-.165-.283-.017-.437.124-.579.127-.127.283-.331.425-.496.142-.165.189-.283.283-.472.094-.189.047-.354-.024-.496-.071-.142-.638-1.538-.874-2.106-.23-.553-.465-.478-.638-.487l-.544-.01c-.189 0-.496.071-.756.354s-.99.968-.99 2.361 1.013 2.739 1.155 2.926c.142.189 1.994 3.042 4.83 4.263.676.292 1.202.467 1.612.598.678.216 1.295.185 1.783.112.544-.081 1.676-.685 1.912-1.348.236-.661.236-1.228.165-1.348-.071-.119-.26-.189-.543-.331Z" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Dados — do FOOTER ANTIGO (POLITEC)
// ---------------------------------------------------------------------------

const quickLinks = [
  { label: "Matrícula", href: "/user/matriculas" },
  { label: "Regulamento", href: "/nosso-regulamento" },
  { label: "Perfil", href: "/user/perfil" },
  { label: "Formações", href: "/cursos" },
];

const plataformas = [
  { label: "Unitec Cursos", href: "https://unitec.ac.mz/cursos" },
  { label: "Unitec Livros", href: "https://unibooks.unitec.ac.mz/" },
  { label: "PROMET", href: "https://promet.unitec.ac.mz" },
  { label: "Unitec BPartner", href: "https://bpartner.unitec.ac.mz/" },
];

const contacts = [
  { icon: MapPin, text: "Av. Salvador Allende Nº 60, Maputo, Moçambique", href: undefined },
  { icon: Phone, text: "(+258) 829232904 | 834303184", href: "tel:+258829232904" },
  { icon: Mail, text: "politec@unitec.ac.mz", href: "mailto:politec@unitec.ac.mz" },
];

const socials = [
  { icon: FacebookIcon, label: "Facebook", href: "https://facebook.com/politec.instituto" },
  { icon: InstagramIcon, label: "Instagram", href: "https://instagram.com/politec.instituto" },
  { icon: TikTokIcon, label: "TikTok", href: "https://tiktok.com/@politec.instituto" },
  { icon: LinkedInIcon, label: "LinkedIn", href: "https://linkedin.com/company/politec-instituto" },
];

const paymentLogos = [
  { name: "M-Pesa", src: mpesaLogo, alt: "M-Pesa" },
  { name: "e-Mola", src: emola, alt: "e-Mola" },
  { name: "VISA", src: visaLogo, alt: "VISA" },
  { name: "Mastercard", src: masterCardLogo, alt: "Mastercard" },
];

const linkColumns = [
  { title: "Links Rápidos", links: quickLinks },
  { title: "Plataformas", links: plataformas },
];

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

export default function Footer() {
  const year = new Date().getFullYear();
  const socialScrollRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const isLanguagePage = pathname?.startsWith("/language");

  const scrollSocials = (direction: "left" | "right") => {
    if (socialScrollRef.current) {
      const scrollAmount = 150;
      socialScrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <footer id="contacto" className="relative overflow-hidden bg-brand-main text-white pt-14">
      {/* Decoração de fundo */}
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
      </div>

      <div className="relative mx-auto px-6 sm:px-10 lg:px-16 pb-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5 lg:gap-12">
          {/* Marca */}
          <div className="md:col-span-2 lg:col-span-2">
            <div className="flex items-center gap-3">
              <Image
                src={Politecfooter}
                alt="POLITEC"
                width={104}
              />
            </div>

            <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/70">
              O POLITEC é um Instituto Médio Politécnico comprometido com a formação
              técnica e profissional de excelência, preparando jovens para os desafios
              do mercado de trabalho e para a construção de um futuro sustentável.
            </p>

            {/* Pagamentos */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {paymentLogos.map((method) => (
                <div
                  key={method.name}
                  className="p-1.5 rounded-md flex items-center justify-center h-10 w-16 bg-white/10"
                  title={method.alt}
                >
                  <Image
                    src={method.src}
                    alt={method.alt}
                    width={120}
                    height={32}
                    className="object-contain h-full w-full"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Colunas de links */}
          {linkColumns.map((column) => (
            <div key={column.title}>
              <h4 className="mb-5 font-bold text-white">{column.title}</h4>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/70 transition-colors duration-200 hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contactos e redes */}
          <div>
            <h4 className="mb-5 font-bold text-white">Contacte-nos</h4>
            <ul className="space-y-4">
              {contacts.map((item) => {
                const content = (
                  <>
                    <item.icon className="h-4 w-4 shrink-0 text-white" />
                    <span>{item.text}</span>
                  </>
                );

                return (
                  <li key={item.text} className="text-sm text-white/70">
                    {item.href ? (
                      <a
                        href={item.href}
                        className="flex items-start gap-3 transition-colors duration-200 hover:text-white"
                      >
                        {content}
                      </a>
                    ) : (
                      <span className="flex items-start gap-3">{content}</span>
                    )}
                  </li>
                );
              })}

              {/* WhatsApp (do footer antigo) */}
              <li className="text-sm text-white/70">
                <a
                  href="https://wa.me/258829232904"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 transition-colors duration-200 hover:text-green-400"
                >
                  <WhatsAppIcon className="h-4 w-4 shrink-0 text-green-400" />
                  <span>WhatsApp</span>
                </a>
              </li>
            </ul>

            {/* Siga-nos com setas e scroll horizontal */}
            <div className="flex items-center justify-between mb-3 mt-8">
              <h4 className="font-bold text-white">Siga-nos</h4>
              <div className="flex gap-1">
                <button
                  onClick={() => scrollSocials("left")}
                  className="p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white/70 hover:text-white"
                  aria-label="Rolar para a esquerda"
                  type="button"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scrollSocials("right")}
                  className="p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white/70 hover:text-white"
                  aria-label="Rolar para a direita"
                  type="button"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div
              ref={socialScrollRef}
              className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory"
            >
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-10 w-10 shrink-0 snap-start items-center justify-center rounded-lg border border-white/15 text-white/80 transition-all duration-300 hover:border-white hover:bg-white hover:text-brand-main"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Barra inferior */}
        <div className="mt-14 border-t border-white/10 pt-8">
          <div className="flex flex-col xl:flex-row items-center justify-between gap-8 mb-6">
            {/* Esquerda: marca */}
            <div className="flex items-center gap-4 w-full xl:w-auto justify-center xl:justify-start">
              <Link
                href="https://unitec.ac.mz"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visitar o site principal da Unitec"
                className="transition-opacity hover:opacity-80"
              >
                <Image
                  src={UnitecFooterNew}
                  alt="POLITEC"
                  width={120}
                  height={40}
                  className="h-10 w-auto"
                />
              </Link>
              <span className="hidden h-6 w-px bg-white/15 sm:block" />
              <span className="hidden text-xs font-semibold uppercase tracking-[0.2em] text-white/60 sm:block">
                Conectando o presente ao futuro
              </span>
            </div>

            {/* Centro: WhatsApp + subscrição */}
            <div className="w-full max-w-2xl flex flex-col sm:flex-row gap-3 items-center justify-center">
              <a
                href="https://wa.me/258829232904"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-white hover:bg-background/90 text-[#25D366] font-semibold px-5 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <WhatsAppIcon className="w-5 h-5" />
                Canal de Ofertas
              </a>

              <form
                className="flex flex-col sm:flex-row gap-2 items-center w-full"
                onSubmit={(e) => e.preventDefault()}
              >
                <div className="relative w-full">
                  <input
                    type="email"
                    placeholder="Email para promoções e novidades"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/50 focus:outline-none focus:border-white transition-colors"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-white text-brand-main hover:bg-white/90 font-semibold px-6 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  Subscrever
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Direita: links legais */}
            <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-white/60 w-full xl:w-auto justify-center xl:justify-end">
              <div className="transition-colors hover:text-white whitespace-nowrap">
                <PrivacyPolicyModal />
              </div>
              <span className="hidden sm:block text-white/20">|</span>
              <Link href="/nossos-termos" className="transition-colors hover:text-white whitespace-nowrap">
                Termos e Condições
              </Link>
            </div>
          </div>

          <div className="text-center text-xs text-white/40 mt-6">
            <span>© {year} POLITEC. Todos os direitos reservados.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}