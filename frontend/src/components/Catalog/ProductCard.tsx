'use client';

import React, { useState } from 'react';
import { STATIC_URL } from '@/lib/config';
import styles from './Catalog.module.css';
import ProductModal from './ProductModal';

interface ProductCardProps {
  name: string;
  quantity: number;
  price: number;
  imagenUrl?: string;
  esExclusivo?: boolean;
  esOferta?: boolean;
  esDomicilio?: boolean;
  descripcion?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  name, quantity, price, imagenUrl, esExclusivo, esOferta, esDomicilio, descripcion 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const fullImgUrl = imagenUrl
    ? (imagenUrl.startsWith('http') ? imagenUrl : `${STATIC_URL}${imagenUrl}`)
    : null;

  return (
    <>
      <div
        className={`${styles.productCard} ${(esExclusivo || esOferta || esDomicilio) ? styles.productCardFeatured : ''} glass-card`}
        onClick={() => setIsOpen(true)}
        style={{
          backgroundImage: fullImgUrl ? `url(${fullImgUrl})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          cursor: 'pointer'
        }}
      >
        {(esExclusivo || esOferta || esDomicilio) && (
          <div className={styles.productBadges}>
            {esExclusivo && <span className={`${styles.badge} ${styles.badgeCombo}`}>Exclusivo</span>}
            {esOferta && <span className={`${styles.badge} ${styles.badgeOferta}`}>Oferta</span>}
            {esDomicilio && <span className={`${styles.badge} ${styles.badgeBestSeller}`}>Envío</span>}
          </div>
        )}

        <div className={styles.cardGlassOverlay}>
          <div className={styles.productInfo}>
            <h3 className="font-bold text-white">{name}</h3>
            <p className="text-[var(--color-plush-soft)]/50 text-xs">Disponibles: {quantity}</p>
            <p className="text-[var(--color-accent-pink)] font-bold">${price}</p>
          </div>
        </div>
      </div>

      <ProductModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        name={name}
        price={price}
        quantity={quantity}
        imagenUrl={fullImgUrl}
        descripcion={descripcion}
      />
    </>
  );
};

export default ProductCard;
