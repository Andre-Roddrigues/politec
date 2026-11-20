"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  X, Shield, Lock, UserCheck, Database, Mail, MapPin,
  Phone, FileText, Eye, Share2, ShieldHalf, NotepadText,
  Book, Contact, CheckCircle2, ChevronRight,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Dados de contacto (confirmar antes de publicar)                    */
/* ------------------------------------------------------------------ */
const CONTACTOS = {
  email: "politec@unitec.ac.mz", // TODO: confirmar email do POLITEC
  morada: "Av. Salvador Allende Nr. 60, Maputo", // TODO: confirmar morada do POLITEC
  whatsapp: "83 430 3184", // TODO: confirmar
  chamadas: "87 008 8787", // TODO: confirmar
};

/* ------------------------------------------------------------------ */
/*  Secções da política (fonte única de verdade)                       */
/* ------------------------------------------------------------------ */
const SECOES = [
  {
    id: "introducao",
    icon: Shield,
    titulo: "Introdução",
    conteudo: (
      <>
        <p>
          O <strong>POLITEC</strong> está comprometido com a proteção e o
          respeito pela sua privacidade. Esta Política de Privacidade explica
          como recolhemos, usamos, divulgamos e protegemos as suas informações
          pessoais quando participa nos nossos cursos, acede ao nosso site ou
          interage connosco.
        </p>
        <p className="mt-3 font-medium text-gray-800">
          Ao inscrever-se no POLITEC ou utilizar os nossos serviços, concorda
          com os termos desta Política de Privacidade.
        </p>
      </>
    ),
  },
  {
    id: "dados",
    icon: Database,
    titulo: "1. Que Informações Recolhemos?",
    conteudo: (
      <>
        <p>
          Recolhemos as informações que nos fornece diretamente, incluindo,
          mas não se limitando a:
        </p>
        <ul>
          <li><strong>Dados de identificação</strong> (nome, data de nascimento, documentos)</li>
          <li><strong>Informações de contacto</strong> (email, número de telefone, endereço)</li>
          <li><strong>Dados académicos e profissionais</strong> (histórico educacional, currículo)</li>
          <li><strong>Documentos carregados no seu perfil</strong> (certificados ou declarações de frequência)</li>
          <li><strong>Dados de pagamento</strong> (comprovativos de transferência)</li>
          <li><strong>Resultados de avaliações</strong> (como o Teste de Diagnóstico)</li>
        </ul>
      </>
    ),
  },
  {
    id: "utilizacao",
    icon: UserCheck,
    titulo: "2. Como Utilizamos as Suas Informações?",
    conteudo: (
      <>
        <p>Utilizamos os seus dados pessoais para os seguintes fins:</p>
        <ul>
          <li>Gerir a sua inscrição e frequência no POLITEC</li>
          <li>Processar pagamentos de propinas, taxas de matrícula e outros encargos</li>
          <li>Fornecer os serviços formativos, incluindo aulas, módulos de reforço e emissão de certificados</li>
          <li>Facilitar o encaminhamento para estágios e oportunidades de emprego com <strong>empresas parceiras</strong></li>
          <li>Comunicar consigo sobre atualizações dos cursos, eventos ou oportunidades relevantes</li>
          <li>Garantir a segurança e o bom funcionamento da instituição</li>
        </ul>
      </>
    ),
  },
  {
    id: "partilha",
    icon: Share2,
    titulo: "3. Partilha de Dados com Terceiros",
    conteudo: (
      <>
        <p className="font-medium text-gray-800">
          Os seus dados pessoais <strong>não serão partilhados com empresas não parceiras</strong>.
        </p>
        <p className="mt-3">Podemos partilhar as suas informações apenas nas seguintes situações:</p>
        <ul>
          <li>
            Com <strong>empresas parceiras</strong> do POLITEC para fins de recrutamento
            e seleção de estágios e empregos, conforme previsto no regulamento.
          </li>
          <li>
            Com prestadores de serviços que nos apoiam na operação dos cursos
            (ex.: plataforma de pagamentos), sujeitos a obrigações de confidencialidade.
          </li>
          <li>Se exigido por lei ou para proteger os nossos direitos legais.</li>
        </ul>
      </>
    ),
  },
  {
    id: "imagem",
    icon: Eye,
    titulo: "4. Uso de Imagem",
    conteudo: (
      <p>
        Ao frequentar o POLITEC, autoriza expressamente a instituição a utilizar
        a sua imagem (fotografias, vídeos) em materiais de divulgação, tanto
        online como offline, sem direito a qualquer remuneração.
      </p>
    ),
  },
  {
    id: "seguranca",
    icon: Lock,
    titulo: "5. Segurança dos Seus Dados",
    conteudo: (
      <p>
        Implementamos medidas técnicas e organizativas adequadas para proteger
        os seus dados pessoais contra acesso, uso ou divulgação não autorizados.
        Os seus dados serão tratados com a confidencialidade devida.
      </p>
    ),
  },
  {
    id: "direitos",
    icon: Book,
    titulo: "6. Os Seus Direitos",
    conteudo: (
      <>
        <p>Tem o direito de:</p>
        <ul>
          <li>Aceder e retificar os seus dados pessoais</li>
          <li>
            Solicitar a eliminação dos seus dados, sujeito a obrigações legais ou
            contratuais que nos impeçam de o fazer
          </li>
          <li>Opor-se ao tratamento dos seus dados para determinados fins</li>
        </ul>
        <p className="mt-3 text-gray-500">
          Para exercer estes direitos, contacte-nos através dos canais indicados
          na secção de contactos.
        </p>
      </>
    ),
  },
  {
    id: "conservacao",
    icon: ShieldHalf,
    titulo: "7. Conservação dos Dados",
    conteudo: (
      <p>
        Conservaremos os seus dados pessoais durante o período necessário para
        cumprir os fins descritos nesta política, incluindo para a manutenção da
        base de talentos e encaminhamento para novas oportunidades, tal como
        previsto no regulamento do POLITEC.
      </p>
    ),
  },
  {
    id: "alteracoes",
    icon: NotepadText,
    titulo: "8. Alterações a Esta Política",
    conteudo: (
      <p>
        Podemos atualizar esta Política de Privacidade periodicamente. Quaisquer
        alterações serão publicadas nesta página, com a data de atualização
        devidamente revista.
      </p>
    ),
  },
  {
    id: "contactos",
    icon: Contact,
    titulo: "9. Contactos",
    conteudo: null, // renderizado à parte
  },
] as const;

/* ------------------------------------------------------------------ */
/*  Componente principal                                               */
/* ------------------------------------------------------------------ */
export default function PrivacyPolicyModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("introducao");
  const scrollRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const openModal = () => {
    setIsOpen(true);
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => setIsVisible(true));
  };

  const closeModal = useCallback(() => {
    setIsVisible(false);
    document.body.style.overflow = "";
    setTimeout(() => setIsOpen(false), 250);
  }, []);

  /* ESC + focus trap */
  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
      if (e.key === "Tab" && modalRef.current) {
        const focusables = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, closeModal]);

  /* Scroll-spy */
  useEffect(() => {
    if (!isOpen) return;
    const container = scrollRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { root: container, rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );

    SECOES.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [isOpen]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    const container = scrollRef.current;
    if (!el || !container) return;
    const top = el.offsetTop - container.offsetTop - 16;
    container.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <>
      <button
        onClick={openModal}
        className="text-gray-500 hover:text-white text-sm transition-colors duration-300 hover:underline underline-offset-2"
      >
        Política de Privacidade
      </button>

      {isOpen && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 transition-opacity duration-250 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden={!isVisible}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
            onClick={closeModal}
          />

          {/* Modal */}
          <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="privacy-title"
            className={`relative flex h-full w-full max-w-5xl flex-col overflow-hidden bg-white shadow-2xl transition-all duration-300 sm:h-[90vh] sm:rounded-2xl ${
              isVisible ? "translate-y-0 scale-100" : "translate-y-4 scale-95"
            }`}
          >
            {/* ───── HEADER ───── */}
            <header className="flex shrink-0 items-center justify-between gap-4 border-b border-gray-200 bg-white px-5 py-4 sm:px-6">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-main/10">
                  <Shield className="h-5 w-5 text-brand-main" />
                </div>
                <div className="min-w-0">
                  <h2 id="privacy-title" className="text-lg font-bold text-gray-900 sm:text-xl">
                    Política de Privacidade
                  </h2>
                  <p className="truncate text-xs text-gray-500 sm:text-sm">
                    POLITEC — Instituto de Formação Profissional
                  </p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="shrink-0 rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
                aria-label="Fechar"
              >
                <X className="h-5 w-5" />
              </button>
            </header>

            {/* ───── BODY ───── */}
            <div className="flex min-h-0 flex-1">
              {/* Índice lateral — só desktop */}
              <aside className="hidden w-60 shrink-0 overflow-y-auto border-r border-gray-200 bg-gray-50 p-4 lg:block">
                <p className="mb-3 px-2 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  Índice
                </p>
                <nav className="space-y-1">
                  {SECOES.map((s) => {
                    const Icon = s.icon;
                    const active = activeSection === s.id;
                    return (
                      <button
                        key={s.id}
                        onClick={() => scrollToSection(s.id)}
                        className={`flex w-full min-w-0 items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                          active
                            ? "bg-brand-main/10 font-semibold text-brand-main"
                            : "text-gray-600 hover:bg-white hover:text-gray-900"
                        }`}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span className="min-w-0 flex-1 truncate">{s.titulo}</span>
                        {active && <ChevronRight className="h-4 w-4 shrink-0 text-brand-main" />}
                      </button>
                    );
                  })}
                </nav>
              </aside>

              {/* Conteúdo scrollável */}
              <div
                ref={scrollRef}
                className="scrollbar-thin min-w-0 flex-1 overflow-y-auto scroll-smooth bg-gray-50 px-4 py-5 sm:px-6 sm:py-6"
              >
                <div className="mx-auto flex w-full max-w-3xl min-w-0 flex-col gap-4">
                  {/* Meta info */}
                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-brand-main/20 bg-brand-main/5 p-4 sm:p-5">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-brand-main">
                        Última atualização: 02 de outubro de 2025
                      </p>
                      <p className="mt-0.5 break-words text-xs text-gray-600">
                        POLITEC • NUIT: 401522050
                      </p>
                    </div>
                    <div className="flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-brand-main shadow-sm">
                      <FileText className="h-3.5 w-3.5" />
                      Documento Oficial
                    </div>
                  </div>

                  {/* Secções */}
                  {SECOES.map((s) => {
                    const Icon = s.icon;
                    return (
                      <section
                        key={s.id}
                        id={s.id}
                        className="scroll-mt-4 min-w-0 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6"
                      >
                        <h3 className="mb-4 flex items-center gap-3 text-base font-bold text-gray-900 sm:text-lg">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-main/10 text-brand-main">
                            <Icon className="h-4 w-4" />
                          </span>
                          <span className="min-w-0 break-words">{s.titulo}</span>
                        </h3>

                        <div className="min-w-0 break-words text-sm leading-relaxed text-gray-600 sm:text-[15px] [&_strong]:font-semibold [&_strong]:text-gray-800 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_ul]:marker:text-brand-main">
                          {s.id === "contactos" ? (
                            <div className="space-y-4">
                              <p>
                                Se tiver alguma dúvida sobre esta Política de Privacidade
                                ou sobre o tratamento dos seus dados pessoais, entre em
                                contacto connosco:
                              </p>
                              <div className="grid gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
                                <a
                                  href={`mailto:${CONTACTOS.email}`}
                                  className="flex min-w-0 items-center gap-3 text-sm text-gray-700 transition-colors hover:text-brand-main"
                                >
                                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-brand-main shadow-sm">
                                    <Mail className="h-4 w-4" />
                                  </span>
                                  <span className="min-w-0 break-all">{CONTACTOS.email}</span>
                                </a>
                                <div className="flex min-w-0 items-start gap-3 text-sm text-gray-700">
                                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-brand-main shadow-sm">
                                    <MapPin className="h-4 w-4" />
                                  </span>
                                  <span className="min-w-0 break-words pt-2">{CONTACTOS.morada}</span>
                                </div>
                                <div className="flex min-w-0 items-start gap-3 text-sm text-gray-700">
                                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-brand-main shadow-sm">
                                    <Phone className="h-4 w-4" />
                                  </span>
                                  <div className="min-w-0 pt-2">
                                    <div>WhatsApp: {CONTACTOS.whatsapp}</div>
                                    <div>Chamadas: {CONTACTOS.chamadas}</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            s.conteudo
                          )}
                        </div>
                      </section>
                    );
                  })}

                  {/* Aceitação */}
                  <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                    <p className="min-w-0 break-words text-sm font-medium leading-relaxed text-emerald-800">
                      Ao utilizar os nossos serviços, reconhece que leu e compreendeu
                      esta Política de Privacidade e concorda com os seus termos.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ───── FOOTER ───── */}
            <footer className="flex shrink-0 flex-col items-center justify-between gap-3 border-t border-gray-200 bg-white px-5 py-3 sm:flex-row sm:px-6">
              <p className="text-xs text-gray-500">POLITEC • NUIT: 401522050</p>
              <button
                onClick={closeModal}
                className="w-full rounded-lg bg-brand-main px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-main/90 sm:w-auto"
              >
                Li e compreendo
              </button>
            </footer>
          </div>
        </div>
      )}
    </>
  );
}