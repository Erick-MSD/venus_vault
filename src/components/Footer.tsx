import React from 'react';
import { ThemeMode, ActiveTab } from '../types';
import { VenusVaultLogo } from './VenusVaultLogo';
import { MapPin, ArrowUp, Mail, ShieldCheck } from 'lucide-react';

interface FooterProps {
  theme: ThemeMode;
  setActiveTab: (tab: ActiveTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ theme, setActiveTab }) => {
  const isDark = theme === 'dark';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      className={`border-t transition-colors ${
        isDark
          ? 'bg-[#0e131f] border-slate-800 text-slate-400'
          : 'bg-slate-50 border-slate-200 text-slate-600'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Logo & Store Info */}
          <div className="space-y-3 md:col-span-1">
            <VenusVaultLogo size="md" theme={theme} showText={true} />
            <p className="text-xs leading-relaxed text-slate-500">
              Plataforma de consulta de precios y compra en línea para coleccionistas de TCG en México. Pokémon, One Piece y piezas de colección.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
              <MapPin size={15} />
              <span>México • Envíos nacionales con DHL</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Navegación
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  onClick={() => setActiveTab('market')}
                  className="hover:text-indigo-600 dark:hover:text-white transition-colors"
                >
                  Catálogo de Precios TCG
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('portfolio')}
                  className="hover:text-indigo-600 dark:hover:text-white transition-colors"
                >
                  Mi Portafolio
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('store')}
                  className="hover:text-indigo-600 dark:hover:text-white transition-colors"
                >
                  Tienda en Línea
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('trade')}
                  className="hover:text-indigo-600 dark:hover:text-white transition-colors"
                >
                  Calculadora de Intercambio
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Games */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Categorías TCG
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-500">
              <li>Pokémon TCG (Scarlet & Violet, 151, SWSH)</li>
              <li>One Piece Card Game (OP-01 a OP-09)</li>
              <li>Cartas Graduadas PSA & BGS</li>
              <li>Booster Boxes & Elite Trainer Boxes</li>
            </ul>
          </div>

          {/* Col 4: Trust & Support */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Soporte y Compras en Línea
            </h4>
            <p className="text-xs text-slate-500">
              Todas las compras y pagos se realizan 100% en línea de manera segura mediante tarjetas y transferencias SPEI.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 pt-1">
              <ShieldCheck size={16} className="text-emerald-500 shrink-0" />
              <span>Transacciones seguras SSL</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
              <Mail size={15} className="text-indigo-500 shrink-0" />
              <span>contacto@venusvault.mx</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} Venus Vault México. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4">
            <span>Precios de mercado sincronizados en USD y MXN</span>
            <button
              onClick={scrollToTop}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors"
              title="Volver arriba"
            >
              <ArrowUp size={14} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
