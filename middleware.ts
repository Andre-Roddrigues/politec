import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;
  const { pathname } = req.nextUrl;

  // Ignorar assets e APIs
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/images")
  ) {
    return NextResponse.next();
  }

  // Nova senha sempre liberada
  if (pathname.startsWith("/nova-senha")) {
    return NextResponse.next();
  }

  // ✅ Cursos públicos e detalhes (/cursos/[id])
  if (pathname === "/cursos" || pathname.startsWith("/cursos/")) {
    return NextResponse.next();
  }

  const publicRoutes = [
    "/",
    "/duvidas",
    "/recuperar-senha",
    "/formulario/parceiro",
    "/registro/teste",
    "/testes",
    "/nossos-termos",
  ];

  const authRoutes = ["/login", "/registro"];

  // Se usuário logado tentar login/registro
  if (token && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/cursos", req.url));
  }

  // Rotas públicas
  if (publicRoutes.includes(pathname) || authRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Sem token → login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}


// Todas as rotas de páginas
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};