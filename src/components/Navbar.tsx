import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const loc = useLocation();
  const isActive = (path: string) => loc.pathname === path ? 'active fw-bold' : '';

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark border-bottom border-primary shadow-sm mb-4">
      <div className="container">
        <Link className="navbar-brand text-primary fw-bold fs-4" to="/">🎓 Portal Acadêmico</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navContent">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 gap-1">
            <li className="nav-item"><Link className={`nav-link ${isActive('/')}`} to="/">📖 Cursos & Conteúdos</Link></li>
            <li className="nav-item"><Link className={`nav-link ${isActive('/progresso')}`} to="/progresso">👤 Meu Progresso & Certificados</Link></li>
            <li className="nav-item"><Link className={`nav-link ${isActive('/financeiro')}`} to="/financeiro">💳 Planos & Checkout</Link></li>
            <li className="nav-item"><Link className={`nav-link ${isActive('/admin')}`} to="/admin">⚙️ Painel de Controle</Link></li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
