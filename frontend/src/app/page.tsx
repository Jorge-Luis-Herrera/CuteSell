'use client';

import { motion } from 'framer-motion';
import { Heart, Sparkles, ChevronRight, Star, Gift, Truck, Award, ShoppingBag } from 'lucide-react';
import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Link from 'next/link';

import { API_URL, STATIC_URL } from '@/lib/config';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const res = await fetch(`${API_URL}/inventory/featured`);
        if (res.ok) {
          const data = await res.json();
          if (data.length > 0) {
            const mapped = data.map((p: any) => ({
              id: p.id,
              title: p.nombre,
              price: p.precio,
              tags: [
                p.esExclusivo && 'Exclusivo',
                p.esOferta && 'Oferta',
                p.esDomicilio && 'Envío'
              ].filter(Boolean),
              img: p.imagenUrl ? (p.imagenUrl.startsWith('http') ? p.imagenUrl : `http://localhost:3000/uploads/${p.imagenUrl}`) : null,
            }));
            setFeaturedProducts(mapped);
          } else {
            setFeaturedProducts([]);
          }
        } else {
          setFeaturedProducts([]);
        }
      } catch (e) {
        setFeaturedProducts([]);
      }
    }
    fetchFeatured();
  }, []);

  const benefits = [
    {
      icon: <Award className="w-8 h-8" />,
      title: 'Materiales Premium',
      desc: 'Cada peluche está hecho con las telas más suaves y seguras.',
      color: 'from-purple-500/20 to-pink-500/20',
      borderColor: 'border-purple-400/20',
    },
    {
      icon: <Truck className="w-8 h-8" />,
      title: 'Envío con Amor',
      desc: 'Tu peluche llega empacado con cariño directo a tus manos.',
      color: 'from-pink-500/20 to-rose-500/20',
      borderColor: 'border-pink-400/20',
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: 'Ediciones Únicas',
      desc: 'Colecciones exclusivas que no encontrarás en otro lugar.',
      color: 'from-amber-500/20 to-orange-500/20',
      borderColor: 'border-amber-400/20',
    },
  ];

  return (
    <main className="min-h-screen relative selection:bg-[var(--color-accent-pink)] selection:text-white">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 -z-10 bg-[#1a1025]">
        <div className="absolute top-[-20%] left-[-10%] w-[55%] h-[55%] rounded-full bg-[#3d2066] blur-[180px] opacity-50 animate-pulse" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[45%] h-[45%] rounded-full bg-[#4a1942] blur-[150px] opacity-40" />
        <div className="absolute top-[40%] right-[20%] w-[30%] h-[30%] rounded-full bg-[#1e3a5f] blur-[120px] opacity-25" />
      </div>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 md:px-12 md:pt-40 max-w-7xl mx-auto min-h-[80vh] flex flex-col justify-center relative">
        {/* Floating decorative elements */}
        <motion.div
          animate={{ y: [-8, 8, -8] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-28 right-10 md:right-20 text-5xl md:text-7xl opacity-20 select-none"
        >
          🧸
        </motion.div>
        <motion.div
          animate={{ y: [6, -6, 6], rotate: [0, 10, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 right-[15%] text-3xl md:text-5xl opacity-15 select-none"
        >
          💜
        </motion.div>
        <motion.div
          animate={{ y: [-5, 5, -5], x: [-3, 3, -3] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[45%] left-[5%] text-2xl md:text-4xl opacity-10 select-none hidden md:block"
        >
          ✨
        </motion.div>

        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-[var(--color-plush-soft)] mb-6"
          >
            <Sparkles className="w-4 h-4 text-[var(--color-accent-pink)]" />
            Nueva Colección Disponible
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] text-white"
          >
            Encuentra tu <br />
            <span className="text-gradient-plush italic">compañero perfecto</span> 🧸
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-6 text-lg md:text-xl text-[var(--color-plush-soft)]/60 max-w-xl font-light"
          >
            Peluches premium que abrazan tus emociones. Suavidad artesanal, calidad
            excepcional y mucho amor en cada puntada.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <Link href="/catalogo">
              <button className="bg-[var(--color-accent-pink)] text-white px-8 py-3.5 rounded-full font-semibold hover:scale-105 hover:shadow-[0_8px_30px_rgba(255,107,157,0.4)] transition-all duration-300 flex items-center gap-2">
                Explorar Colección <ChevronRight className="w-4 h-4" />
              </button>
            </Link>
            <button
              className="glass-panel px-8 py-3.5 rounded-full font-medium hover:bg-white/5 transition-colors flex items-center gap-2 relative border border-white/10"
            >
              <Heart className="w-4 h-4 text-[var(--color-accent-pink)]" /> Nuestra Historia
            </button>
          </motion.div>
        </div>
      </section>

      {/* Marquee Section */}
      <section className="overflow-hidden border-y border-white/5 py-4 bg-white/[0.02]">
        <div className="flex whitespace-nowrap" style={{ animation: 'marquee 25s linear infinite' }}>
          {[...Array(2)].map((_, i) => (
            <span key={i} className="text-sm font-medium tracking-[0.3em] uppercase text-[var(--color-plush-soft)]/30 mx-4">
              ✨ Soft & Cuddly &nbsp;&nbsp; 💜 Premium Quality &nbsp;&nbsp; 🧸 Handmade with Love &nbsp;&nbsp; 🌸 Ediciones Exclusivas &nbsp;&nbsp; 💖 Abrazos Garantizados &nbsp;&nbsp; ⭐ Coleccionables &nbsp;&nbsp;
            </span>
          ))}
        </div>
      </section>

      {/* Featured Products — Bento Grid */}
      <section className="px-6 md:px-12 py-20 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-10">
          <div>
            <p className="text-[var(--color-accent-pink)] text-xs uppercase tracking-[0.3em] font-bold mb-2">Selección Especial</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Los Más <span className="text-gradient-plush">Adorables</span>
            </h2>
          </div>
          <Link href="/catalogo" className="hidden md:flex items-center gap-1 text-sm text-[var(--color-plush-soft)]/60 hover:text-[var(--color-accent-pink)] transition-colors">
            Ver todo <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[300px]">
          {featuredProducts.length > 0 ? (
            featuredProducts.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ scale: 1.03, y: -4 }}
                className={`glass-card group relative cursor-pointer ${
                  i % 4 === 0 ? 'md:col-span-2 md:row-span-2' : ''
                } ${i % 4 === 3 ? 'md:col-span-2' : ''}`}
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110 opacity-70"
                  style={{ backgroundImage: `url('${item.img}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1025]/90 via-[#1a1025]/30 to-transparent" />
                
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <div className="flex gap-2 mb-auto">
                    {item.tags?.map((tag: string) => (
                      <span key={tag} className="px-3 py-1 bg-[var(--color-plush-mid)]/80 backdrop-blur-md rounded-full text-[10px] font-black uppercase text-white border border-white/10">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    {item.title}
                  </h3>
                  <div className="flex justify-between items-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <span className="text-[var(--color-accent-pink)] font-bold">${item.price}</span>
                    <button className="bg-white/10 hover:bg-[var(--color-accent-pink)]/30 p-2.5 rounded-full backdrop-blur-md transition-colors border border-white/10">
                      <Heart className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center glass-card border-dashed">
              <div className="text-5xl mb-4">🧸</div>
              <p className="text-[var(--color-plush-soft)]/40 italic">Preparando nuestra colección adorable...</p>
            </div>
          )}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="px-6 md:px-12 py-20 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            ¿Por qué <span className="text-gradient-plush">Cute Sell</span>?
          </h2>
          <p className="text-[var(--color-plush-soft)]/50 max-w-md mx-auto">
            Más que peluches — experiencias que abrazan tu corazón.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {benefits.map((b, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className={`glass-card p-8 text-center relative overflow-hidden group cursor-default ${b.borderColor}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${b.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center p-4 bg-white/5 rounded-2xl mb-5 text-[var(--color-accent-pink)] group-hover:scale-110 transition-transform duration-300">
                  {b.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{b.title}</h3>
                <p className="text-[var(--color-plush-soft)]/50 text-sm leading-relaxed">{b.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 md:px-12 py-20 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[2rem] p-10 md:p-16 text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(107, 76, 154, 0.3), rgba(255, 107, 157, 0.2), rgba(126, 218, 185, 0.15))',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-[var(--color-accent-pink)]/10 blur-[80px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-[var(--color-accent-mint)]/10 blur-[60px] rounded-full" />
          
          <div className="relative z-10">
            <div className="text-5xl mb-6">🧸💜</div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              ¿Listo para encontrar tu peluche ideal?
            </h2>
            <p className="text-[var(--color-plush-soft)]/60 mb-8 max-w-lg mx-auto">
              Explora nuestra colección completa y encuentra ese compañero especial que te está esperando.
            </p>
            <Link href="/catalogo">
              <button className="bg-[var(--color-accent-pink)] text-white px-10 py-4 rounded-full font-bold text-lg hover:scale-105 hover:shadow-[0_8px_30px_rgba(255,107,157,0.4)] transition-all duration-300 flex items-center gap-3 mx-auto">
                <ShoppingBag className="w-5 h-5" /> Ver Colección Completa
              </button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 mt-10 px-6 py-12 text-center text-sm text-[var(--color-plush-soft)]/30">
        <p>© 2026 Cute Sell. Hecho con 💜 para los amantes de los peluches.</p>
      </footer>
    </main>
  );
}
