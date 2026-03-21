import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import Header from '@/components/Header/Header';
import { SearchProvider } from '@/contexts/SearchContext';
import './globals.css';

const outfit = Outfit({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700', '800', '900'] });

export const metadata: Metadata = {
  title: 'Cute Sell — Tu Mundo de Peluches',
  description: 'Descubre la colección más adorable de peluches premium. Suavidad, calidad y amor en cada abrazo.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${outfit.className} antialiased`}
      >
        <div id="dev-overlay-remover" />
        <SearchProvider>
          <Header />
          <main>
            {children}
          </main>
        </SearchProvider>
        
        {/* Dynamic Dev Overlay Remover */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            const remove = () => {
              const selectors = ['nextjs-portal', '[data-nextjs-toast]', '.nextjs-static-indicator-container'];
              selectors.forEach(s => {
                document.querySelectorAll(s).forEach(el => el.remove());
              });
            };
            remove();
            const observer = new MutationObserver(remove);
            observer.observe(document.documentElement, { childList: true, subtree: true });
          })();
        `}} />
      </body>
    </html>
  );
}
