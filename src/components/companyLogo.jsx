import React, { useState, useEffect } from 'react';

const CompanyLogo = ({ nomEmpresa }) => {
  const [logoUrl, setLogoUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const baseName = nomEmpresa.toLowerCase().trim().replace(/\s+/g, '');
    
    // Lista de URLs candidatas a probar simultáneamente
    const candidates = [
      `https://logos.hunter.io/${baseName}.com`,
      `https://logos.hunter.io/${baseName}.com.ec`,
      `https://logos.hunter.io/${baseName}.ec`
    ];

    // Función que intenta cargar una imagen individualmente
    const loadImage = (url) =>
      new Promise((resolve, reject) => {
        const img = new Image();
        img.src = url;
        img.onload = () => resolve(url);
        img.onerror = () => reject(url);
      });

    // Dispara todas las peticiones en paralelo
    Promise.any(candidates.map(loadImage))
      .then((firstValidUrl) => {
        setLogoUrl(firstValidUrl);
      })
      .catch(() => {
        // Si absolutamente todas fallan, asigna un placeholder
        setLogoUrl('https://via.placeholder.com/50?text=Logo');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [nomEmpresa]);

  return (
    <div className="logo-container">
      {loading ? (
        <div className="logo-skeleton" />
      ) : (
        <img
          src={logoUrl}
          alt={`Logo ${nomEmpresa}`}
          className="company-logo"
        />
      )}
    </div>
  );
};

export default CompanyLogo;