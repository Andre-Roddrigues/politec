import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;
  const { pathname } = req.nextUrl;

  // Rotas públicas (sempre acessíveis sem login)
  const publicRoutes = [
    "/",
    "/duvidas",
    "/recuperar-senha",
    "/formulario/parceiro",
    "/cursos",
    "/registro/teste",
    "/testes",
    "/nossos-termos",
     "/nova-senha",         // adicionado
    "/nova-senha/[otp]",
  ];

  // Rotas especiais que não podem ser acessadas após login
  const authRoutes = ["/login", "/registro", "/nova-senha",         // adicionado
    "/nova-senha/[otp]"];
  if (pathname.startsWith("/nova-senha")) {
    return NextResponse.next();
  }
  // Ignorar assets e APIs
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/images")
  ) {
    return NextResponse.next();
  }

  // Se usuário já logado tentar ir para login/registro → manda para perfil
  if (token && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/cursos", req.url));
  }

  // Se rota pública → libera
  if (publicRoutes.includes(pathname) || authRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Se não houver token → redireciona para login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Senão, libera
  return NextResponse.next();
}

// Todas as rotas de páginas
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
