'use client';

import React, { useState, useEffect, useMemo } from 'react';
import ShelfRow from '@/components/Catalog/ShelfRow';
import { motion, AnimatePresence } from 'framer-motion';
import { API_URL } from '@/lib/config';
import { useSearch } from '@/contexts/SearchContext';

export default function CatalogoPage() {
  const { searchQuery } = useSearch();
  const [inventario, setInventario] = useState<any[]>([]);
  const [destacados, setDestacados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [invRes, featRes] = await Promise.all([
          fetch(`${API_URL}/inventory`),
          fetch(`${API_URL}/inventory/featured`)
        ]);

        if (invRes.ok && featRes.ok) {
          const inv = await invRes.json();
          const feat = await featRes.json();
          setInventario(inv);
          setDestacados(feat);
        }
      } catch (error) {
        console.error('Error fetching catalog:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const inventarioAMostrar = useMemo(() => {
    const lista = [];
    const searchLower = searchQuery.toLowerCase().trim();

    // Filtrar destacados de manera optimizada
    let destacadosFiltrados = destacados;
    if (searchLower) {
      destacadosFiltrados = destacados.filter((p: any) => 
        p.nombre.toLowerCase().includes(searchLower) || 
        (p.descripcion && p.descripcion.toLowerCase().includes(searchLower))
      );
    }

    if (destacadosFiltrados.length > 0) {
      lista.push({
        id: 'featured-shelf',
        titulo: 'Los Más Queridos 💜',
        subtitulo: 'SELECCIÓN EXCLUSIVA CUTE SELL',
        items: destacadosFiltrados,
        isFeatured: true
      });
    }

    // Optimizar filtrado de inventario
    inventario.forEach(shelf => {
      const shelfMatches = !searchLower || shelf.titulo.toLowerCase().includes(searchLower);
      
      const productosFiltrados = (shelf.productos || []).filter((p: any) => {
        if (!searchLower || shelfMatches) return true;
        return p.nombre.toLowerCase().includes(searchLower) || 
               (p.descripcion && p.descripcion.toLowerCase().includes(searchLower));
      });

      if (productosFiltrados.length > 0) {
        lista.push({
          id: shelf.id,
          titulo: shelf.titulo,
          items: productosFiltrados,
          isFeatured: false 
        });
      }
    });

    return lista;
  }, [inventario, destacados, searchQuery]);

  return (
    <div className="min-h-screen bg-[#1a1025] text-white selection:bg-[var(--color-accent-pink)] selection:text-white">
      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black tracking-tight mb-4"
          >
            NUESTRA <span className="text-gradient-plush italic">COLECCIÓN</span> 🧸
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-[var(--color-plush-soft)]/50"
          >
            Descubre peluches que enamoran a primera vista.
          </motion.p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
             <div className="w-12 h-12 border-4 border-[var(--color-accent-pink)] border-t-transparent rounded-full animate-spin" />
             <p className="text-[var(--color-plush-soft)]/40 animate-pulse">Buscando tus futuros favoritos...</p>
          </div>
        ) : (
          <div className="space-y-12">
            <AnimatePresence mode="popLayout">
              {inventarioAMostrar.length > 0 ? (
                inventarioAMostrar.map((s, idx) => (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <ShelfRow
                      title={s.titulo}
                      subtitle={s.subtitulo}
                      items={s.items}
                      isFeatured={s.isFeatured}
                    />
                  </motion.div>
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20 bg-[var(--color-plush-mid)]/10 rounded-3xl border border-white/5"
                >
                  <div className="text-5xl mb-4">🔍</div>
                  <p className="text-[var(--color-plush-soft)]/40 italic">No encontramos peluches con ese nombre. ¡Intenta otra búsqueda!</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
}
