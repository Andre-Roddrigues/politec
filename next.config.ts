import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ✅ Colocar dentro de experimental para evitar erro
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },

  // ✅ Suporte para importar SVG como componente React
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      issuer: /\.[jt]sx?$/, // evita conflito com arquivos de imagem
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;
