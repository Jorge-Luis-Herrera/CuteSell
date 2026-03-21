import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true
  },
  turbopack: {
    // Configurar Turbopack para resolver desde el directorio del frontend
    resolveAlias: {
      '@': '.'
    }
  },
  // Eliminar configuración webpack para evitar conflictos
  // webpack: (config, { dir }) => {
  //   config.context = dir;
  //   return config;
  // }
};

export default nextConfig;