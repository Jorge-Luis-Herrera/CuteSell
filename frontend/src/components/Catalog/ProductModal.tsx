'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Heart, Maximize2 } from 'lucide-react';
import { CONTACT_PHONE } from '@/lib/config';
import styles from './Catalog.module.css';

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    name: string;
    price: number;
    quantity: number;
    imagenUrl: string | null;
    descripcion?: string;
}

const ProductModal: React.FC<ProductModalProps> = ({
    isOpen, onClose, name, price, quantity, imagenUrl, descripcion
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [compraCantidad, setCompraCantidad] = useState(1);

    useEffect(() => {
        if (isOpen || isExpanded) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { 
            if (typeof document !== 'undefined') {
                document.body.style.overflow = 'unset'; 
            }
        };
    }, [isOpen, isExpanded]);

    if (!isOpen) return null;

    const whatsappUrl = `https://wa.me/${CONTACT_PHONE.replace(/\s+/g, '')}?text=${encodeURIComponent(`¡Hola Cute Sell! Me interesa comprar ${compraCantidad} unidad(es) de: ${name}`)}`;

    return createPortal(
        <>
            <div className={styles.modalOverlay} onClick={onClose}>
                <div className={`${styles.modalContent3d} glass-panel`} onClick={(e) => e.stopPropagation()}>
                    <button className={styles.closeModal} onClick={onClose} aria-label="Cerrar"><X size={20} /></button>

                    <div className={styles.modalBody}>
                        <div 
                            className={styles.imageContainer3d} 
                            onClick={() => setIsExpanded(true)}
                            style={{ cursor: 'zoom-in' }}
                        >
                            {imagenUrl ? (
                                <img src={imagenUrl} alt={name} className={styles.mainImage3d} />
                            ) : (
                                <div className="w-full h-full bg-[var(--color-plush-mid)]/20 flex items-center justify-center rounded-xl text-[var(--color-plush-soft)]/40 italic text-6xl"></div>
                            )}
                            <div className={styles.clickHint}><Maximize2 size={12} className="inline mr-1" /> Toca para ampliar</div>
                        </div>

                        <div className={styles.detailsSection}>
                            <h2 className="text-2xl font-bold text-white mb-2">{name}</h2>
                            <div className={styles.statsGrid}>
                                <div className={styles.stat}>
                                    <label>Precio</label>
                                    <span className="text-[var(--color-accent-pink)]">${price}</span>
                                </div>
                                <div className={styles.stat}>
                                    <label>Stock</label>
                                    <span>{quantity}</span>
                                </div>
                                <div className={styles.stat}>
                                    <label>Cantidad</label>
                                    <div className={styles.quantitySelector}>
                                        <button onClick={() => setCompraCantidad(Math.max(1, compraCantidad - 1))}>-</button>
                                        <input
                                            type="number"
                                            value={compraCantidad}
                                            onChange={(e) => setCompraCantidad(Math.max(1, parseInt(e.target.value) || 1))}
                                            className="w-10 bg-transparent text-center text-white"
                                        />
                                        <button onClick={() => setCompraCantidad(compraCantidad + 1)}>+</button>
                                    </div>
                                </div>
                            </div>
                            
                            <p className="text-[var(--color-plush-soft)]/60 text-sm leading-relaxed my-4 h-24 overflow-y-auto custom-scrollbar">
                                {descripcion || "Este peluche ha sido seleccionado con amor para brindarte la mejor experiencia Cute Sell. Suave, adorable y perfecto para abrazar."}
                            </p>

                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`${styles.actionBtn} w-full flex items-center justify-center gap-2`}
                            >
                                <Heart size={18} /> ¡Lo quiero!
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {isExpanded && (
                <div className={styles.fullscreenImageOverlay} onClick={() => setIsExpanded(false)} style={{ zIndex: 20001 }}>
                    <button className={styles.closeExpanded} onClick={() => setIsExpanded(false)} aria-label="Cerrar imagen completa"><X size={32} /></button>
                    <img src={imagenUrl!} alt={name} className={styles.expandedImage} />
                </div>
            )}
        </>,
        document.body
    );
};

export default ProductModal;
