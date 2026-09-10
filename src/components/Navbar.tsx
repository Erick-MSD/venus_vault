import React, { useState } from 'react';
import { ActiveTab, Currency, ThemeMode, CartItem } from '../types';
import { VenusVaultLogo } from './VenusVaultLogo';
import { formatPrice } from '../utils/currency';
import {
  Store,
  LineChart,
  Briefcase,
  ArrowLeftRight,
  Sun,
  Moon,
  ShoppingCart,
  Search,
  Menu,
  X,
  Compass,
} from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  cartItems: CartItem[];
  setIsCartOpen: (open: boolean) => void;
  portfolioTotalUsd: number;
  onOpenQuickSearch: () => void;
  exchangeRate?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currency,
  setCurrency,
  theme,
  setTheme,
  cartItems,
  setIsCartOpen,
  portfolioTotalUsd,
  onOpenQuickSearch,
  exchangeRate = 18.65,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isDark = theme === 'dark';

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const portfolioFormatted = formatPrice(portfolioTotalUsd, currency, false, exchangeRate);

  const navLinks: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'market', label: 'Catálogo & Precios', icon: <LineChart size={15} /> },
    { id: 'store', label: 'Tienda en Línea', icon: <Store size={15} /> },
    { id: 'portfolio', label: 'Mi Portafolio', icon: <Briefcase size={15} /> },
    { id: 'trade', label: 'Mesa de Intercambio', icon: <ArrowLeftRight size={15} /> },
  ];

  return (
    <header
      className={`sticky top-0 z-40 transition-colors duration-150 border-b ${
        isDark
          ? 'bg-[#0b0f19]/95 border-slate-800 text-slate-100 shadow-xs'
          : 'bg-white/95 border-slate-200 text-slate-900 shadow-xs'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Brand / Logo */}
        <div
          onClick={() => setActiveTab('market')}
          className="cursor-pointer transition-transform hover:scale-[1.01] active:scale-98 flex items-center shrink-0"
          id="navbar-brand-logo"
        >
          <VenusVaultLogo size="sm" theme={theme} showText={true} />
        </div>

        {/* Desktop Navigation Links (Collectr Clean Navigation) */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                id={`nav-link-${link.id}`}
                onClick={() => setActiveTab(link.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : isDark
                    ? 'text-slate-300 hover:text-white hover:bg-slate-800'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Tools: Search, Currency, Theme, Cart, Portfolio pill */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Quick Search trigger */}
          <button
            onClick={onOpenQuickSearch}
            id="navbar-search-btn"
            className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
              isDark
                ? 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            <Search size={14} className="text-slate-400" />
            <span className="hidden lg:inline">Buscar carta o set...</span>
            <span className="lg:hidden">Buscar</span>
            <kbd
              className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-600'
              }`}
            >
              /
            </kbd>
          </button>

          {/* Quick Portfolio Balance Pill */}
          <button
            onClick={() => setActiveTab('portfolio')}
            id="navbar-portfolio-badge"
            className={`hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-xl border text-xs font-bold transition-transform hover:scale-[1.02] ${
              isDark
                ? 'bg-slate-900 border-slate-800 text-slate-200'
                : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}
            title="Valor estimado de tu portafolio"
          >
            <Briefcase size={13} className="text-indigo-500" />
            <div className="flex flex-col items-start text-left leading-tight">
              <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">Portafolio</span>
              <span className="font-extrabold">{portfolioFormatted.primary}</span>
            </div>
          </button>

          {/* Currency Toggle (USD / MXN / DUAL) */}
          <div
            className={`flex items-center p-0.5 rounded-xl border ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
            }`}
          >
            <button
              onClick={() => setCurrency('USD')}
              id="currency-toggle-usd"
              className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                currency === 'USD'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : isDark
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              USD
            </button>
            <button
              onClick={() => setCurrency('MXN')}
              id="currency-toggle-mxn"
              className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                currency === 'MXN'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : isDark
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              MXN
            </button>
            <button
              onClick={() => setCurrency('DUAL')}
              id="currency-toggle-dual"
              className={`hidden sm:block px-2 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                currency === 'DUAL'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : isDark
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Dual
            </button>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            id="theme-toggle-btn"
            className={`p-2 rounded-xl border transition-colors ${
              isDark
                ? 'bg-slate-900 border-slate-800 text-amber-400 hover:bg-slate-800'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
            title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          >
            {isDark ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {/* Shopping Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            id="cart-drawer-trigger"
            className={`relative p-2 rounded-xl border transition-colors ${
              isDark
                ? 'bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-800'
                : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
            }`}
            title="Carrito de compras"
          >
            <ShoppingCart size={15} />
            {totalCartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 rounded-full bg-indigo-600 text-white text-[10px] font-black flex items-center justify-center">
                {totalCartCount}
              </span>
            )}
          </button>

          {/* Mobile Hamburger Menu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-2 rounded-xl border transition-colors ${
              isDark ? 'border-slate-800 text-slate-200' : 'border-slate-200 text-slate-800'
            }`}
            id="mobile-menu-toggle"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div
          className={`md:hidden border-b px-4 py-3 space-y-2 ${
            isDark ? 'bg-[#0f1420] border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenQuickSearch();
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-xs font-semibold ${
              isDark
                ? 'bg-slate-900 border-slate-800 text-slate-300'
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <Search size={14} className="text-slate-400" />
              <span>Buscar cartas o expansiones...</span>
            </div>
          </button>

          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                setActiveTab(link.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === link.id
                  ? 'bg-indigo-600 text-white'
                  : isDark
                  ? 'text-slate-300 hover:bg-slate-800'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {link.icon}
                <span>{link.label}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
