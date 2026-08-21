import React from 'react';

const CompanyLogo = ({ dominioLogo, nomEmpresa }) => {
  // Si en la BD la empresa no tiene dominio asignado todavía
  if (!dominioLogo) {
    const iniciales = nomEmpresa.substring(0, 2).toUpperCase();
    return <div className="company-avatar">{iniciales}</div>;
  }

  return (
    <img
      src={`https://logos.hunter.io/${dominioLogo}`}
      alt={`Logo ${nomEmpresa}`}
      className="company-logo"
      onError={(e) => {
        // Fallback rápido si el dominio guardado en BD no devuelve imagen en Hunter
        e.target.style.display = 'none';
      }}
    />
  );
};

export default CompanyLogo;