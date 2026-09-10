import React from 'react';
import { Card, StoreProduct, Currency, ThemeMode, ActiveTab } from '../types';
import { VenusVaultLogo } from './VenusVaultLogo';
import { formatPrice, formatChange } from '../utils/currency';
import {
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Zap,
  ShoppingBag,
  Briefcase,
  Layers,
  Sparkles,
  Search,
  CheckCircle2,
  DollarSign,
  PackageCheck,
  Flame,
} from 'lucide-react';
import { motion } from 'motion/react';

interface LandingViewProps {
  cards: Card[];
  storeProducts: StoreProduct[];
  setActiveTab: (tab: ActiveTab) => void;
  onSelectCard: (card: Card) => void;
  onQuickAdd: (card: Card) => void;
  onAddToCart: (product: StoreProduct) => void;
  onSelectProduct?: (product: StoreProduct) => void;
  currency: Currency;
  theme: ThemeMode;
}

export const LandingView: React.FC<LandingViewProps> = ({
  cards,
  storeProducts,
  setActiveTab,
  onSelectCard,
  onQuickAdd,
  onAddToCart,
  onSelectProduct,
  currency,
  theme,
}) => {
  const isDark = theme === 'dark';

  // Highlight top 4 trending cards
  const topTrending = [...cards]
    .sort((a, b) => b.change7d - a.change7d)
    .slice(0, 4);

  // Featured store products
  const featuredProducts = storeProducts.slice(0, 4);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative pt-6 sm:pt-12 overflow-hidden">
        {/* Background ambient purple orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-purple-600/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/2 right-10 w-[350px] h-[350px] bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Top Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-bold tracking-wide"
              style={{
                backgroundColor: isDark ? 'rgba(88, 28, 135, 0.25)' : 'rgba(243, 232, 255, 0.8)',
                borderColor: isDark ? 'rgba(147, 51, 234, 0.4)' : 'rgba(192, 132, 252, 0.5)',
                color: isDark ? '#D8B4FE' : '#6B21A8',
              }}
            >
              <Sparkles size={14} className="text-purple-400" />
              <span>EL SANTUARIO DEL COLECCIONISMO TCG EN MÉXICO</span>
            </motion.div>

            {/* Main Hero Visual Logo & Heading */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center justify-center space-y-4"
            >
              <VenusVaultLogo size="xl" theme={theme} showText={false} />
              
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
                <span className="block font-['Cinzel',serif] tracking-[0.1em] text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-purple-300 to-purple-500 dark:from-white dark:via-purple-200 dark:to-purple-400">
                  VENUS VAULT
                </span>
                <span
                  className={`block text-2xl sm:text-3xl font-extrabold font-['Outfit',sans-serif] mt-2 tracking-normal ${
                    isDark ? 'text-purple-300/90' : 'text-purple-900'
                  }`}
                >
                  Mercado, Tienda & Portafolio TCG
                </span>
              </h1>
            </motion.div>

            {/* Description */}
            <p
              className={`text-base sm:text-lg max-w-2xl mx-auto leading-relaxed ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              Especialistas en <strong>Pokémon</strong>, <strong>One Piece Card Game</strong> y cartas coleccionables.
              Cotizaciones en tiempo real en <span className="text-purple-400 font-semibold">USD y MXN</span>,
              adición a portafolio en 1 clic más intuitiva que Collectr, y tienda oficial con stock verificado.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setActiveTab('market')}
                className="px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-xl shadow-purple-900/40 flex items-center gap-2.5 transition-transform active:scale-95"
              >
                <span>Explorar Mercado & Precios</span>
                <ArrowRight size={16} />
              </button>

              <button
                onClick={() => setActiveTab('portfolio')}
                className={`px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-bold border transition-all flex items-center gap-2.5 ${
                  isDark
                    ? 'border-purple-800/60 bg-purple-950/40 text-purple-200 hover:bg-purple-900/40'
                    : 'border-purple-200 bg-white text-purple-900 hover:bg-purple-50 shadow-sm'
                }`}
              >
                <Briefcase size={16} className="text-purple-400" />
                <span>Gestionar Mi Portafolio</span>
              </button>

              <button
                onClick={() => setActiveTab('store')}
                className={`px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-bold border transition-all flex items-center gap-2.5 ${
                  isDark
                    ? 'border-purple-800/60 bg-[#160D2E] text-slate-200 hover:border-purple-500'
                    : 'border-slate-200 bg-purple-50/50 text-slate-800 hover:bg-purple-100'
                }`}
              >
                <ShoppingBag size={16} className="text-purple-400" />
                <span>Ver Tienda (ETBs & Singles)</span>
              </button>
            </div>

            {/* Live Market Bar Ticker */}
            <div
              className={`mt-8 p-3 rounded-2xl border flex flex-wrap items-center justify-around gap-4 text-xs ${
                isDark
                  ? 'bg-[#120B24] border-purple-900/40 text-slate-300'
                  : 'bg-purple-50/70 border-purple-200/60 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-semibold">Tipo de Cambio TCG México:</span>
                <span className="font-extrabold text-purple-400">$1.00 USD = $18.65 MXN</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-400" />
                <span>Autenticidad Garantizada Venus Vault</span>
              </div>
              <div className="flex items-center gap-2">
                <PackageCheck size={16} className="text-purple-400" />
                <span>Envíos Blindados a Toda la República</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Section: Top Trending Cards in Market */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
              <Flame size={20} />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">Tendencias del Mercado TCG</h2>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Cartas más codiciadas de Pokémon y One Piece con cotización en vivo
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('market')}
            className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1 group"
          >
            <span>Ver todo el catálogo</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {topTrending.map((card) => {
            const price = formatPrice(card.priceUsd, currency);
            const change = formatChange(card.change7d);

            return (
              <motion.div
                key={card.id}
                whileHover={{ y: -4 }}
                className={`relative rounded-2xl overflow-hidden p-4 border transition-all flex flex-col justify-between ${
                  isDark
                    ? 'bg-[#130E26] border-purple-900/40 hover:border-purple-600/60 shadow-lg shadow-purple-950/40'
                    : 'bg-white border-purple-100 hover:border-purple-300 shadow-sm shadow-purple-900/5'
                }`}
              >
                {/* Header tags */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                      card.game === 'pokemon'
                        ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                        : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {card.game === 'pokemon' ? 'Pokémon' : 'One Piece'}
                  </span>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      change.isPositive
                        ? 'bg-emerald-500/15 text-emerald-400'
                        : 'bg-rose-500/15 text-rose-400'
                    }`}
                  >
                    <TrendingUp size={11} />
                    <span>{change.text} 7d</span>
                  </span>
                </div>

                {/* Card Artwork */}
                <div
                  onClick={() => onSelectCard(card)}
                  className="relative cursor-pointer aspect-[3/4] flex items-center justify-center py-2 group"
                >
                  <img
                    src={card.image}
                    alt={card.name}
                    referrerPolicy="no-referrer"
                    className="max-h-52 w-auto object-contain rounded-lg drop-shadow-xl transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Card Details */}
                <div className="mt-3 space-y-2">
                  <div onClick={() => onSelectCard(card)} className="cursor-pointer">
                    <span className={`text-[11px] block truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {card.set} • #{card.cardNumber}
                    </span>
                    <h3 className="text-sm font-bold truncate hover:text-purple-400 transition-colors">
                      {card.name}
                    </h3>
                  </div>

                  {/* Price Row */}
                  <div className="flex items-baseline justify-between pt-1">
                    <div>
                      <span className="text-base font-extrabold text-purple-400">{price.primary}</span>
                      {price.secondary && (
                        <span className={`text-[11px] block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          {price.secondary}
                        </span>
                      )}
                    </div>

                    {/* Quick Add Button */}
                    <button
                      onClick={() => onQuickAdd(card)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 shadow-md shadow-purple-600/30 flex items-center gap-1 transition-transform active:scale-95"
                      title="Agregar a mi portafolio"
                    >
                      <span>+ Portafolio</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Store Highlights & Promotions */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`p-6 sm:p-8 rounded-3xl border overflow-hidden relative ${
            isDark
              ? 'bg-gradient-to-br from-[#180F33] via-[#110A24] to-[#0A0518] border-purple-800/40 shadow-2xl'
              : 'bg-gradient-to-br from-purple-100/70 via-purple-50/50 to-white border-purple-200'
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-purple-400 uppercase tracking-wider mb-1">
                <ShoppingBag size={15} />
                <span>Tienda Oficial Venus Vault</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                Productos Sellados, ETBs & Singles en Stock
              </h2>
              <p className={`text-xs sm:text-sm mt-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Disponible para entrega inmediata en México o envío seguro con toploader y burbuja.
              </p>
            </div>

            <button
              onClick={() => setActiveTab('store')}
              className="self-start md:self-auto px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 shadow-md shadow-purple-600/30 flex items-center gap-2"
            >
              <span>Ver Catálogo Completo de la Tienda</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredProducts.map((prod) => {
              const price = formatPrice(prod.priceUsd, currency);
              const origPrice = prod.originalPriceUsd ? formatPrice(prod.originalPriceUsd, currency) : null;

              return (
                <div
                  key={prod.id}
                  className={`p-4 rounded-2xl border flex flex-col justify-between transition-all group ${
                    isDark
                      ? 'bg-[#100922]/80 border-purple-900/50 hover:border-purple-600/60'
                      : 'bg-white border-purple-200/80 hover:border-purple-400 shadow-xs'
                  }`}
                >
                  <div
                    onClick={() => onSelectProduct ? onSelectProduct(prod) : setActiveTab('store')}
                    className="cursor-pointer"
                    title="Ver detalle del producto"
                  >
                    {/* Badge */}
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                          prod.badge === 'OFERTA'
                            ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                            : prod.badge === 'PREVENTA'
                            ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                            : prod.badge === 'DESTACADO'
                            ? 'bg-purple-500/20 text-purple-600 dark:text-purple-300 border border-purple-500/30'
                            : 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 border border-indigo-500/30'
                        }`}
                      >
                        {prod.badge || 'EN STOCK'}
                      </span>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                        {prod.stock} disponibles
                      </span>
                    </div>

                    {/* Image */}
                    <div className="aspect-square flex items-center justify-center p-2 my-2 bg-slate-100 dark:bg-black/20 rounded-xl">
                      <img
                        src={prod.image}
                        alt={prod.title}
                        referrerPolicy="no-referrer"
                        className="max-h-36 w-auto object-contain drop-shadow group-hover:scale-103 transition-transform duration-200"
                      />
                    </div>

                    <h4 className="text-xs font-bold line-clamp-2 mt-2 text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {prod.title}
                    </h4>
                  </div>

                  <div className="mt-4 pt-3 border-t border-purple-900/20 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-black text-purple-400">{price.primary}</span>
                        {origPrice && (
                          <span className="text-[10px] line-through text-slate-400">
                            {origPrice.primary}
                          </span>
                        )}
                      </div>
                      <span className={`text-[10px] block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {price.secondary}
                      </span>
                    </div>

                    <button
                      onClick={() => onAddToCart(prod)}
                      className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-600/30 transition-transform active:scale-95"
                      title="Añadir a carrito"
                    >
                      <ShoppingBag size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Venus Vault Section (Comparison with Collectr) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            ¿Por qué coleccionar en Venus Vault?
          </h2>
          <p className={`text-xs sm:text-sm mt-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Diseñado pensando en la comunidad TCG de México, eliminando los dolores de cabeza de otras apps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            className={`p-6 rounded-2xl border ${
              isDark ? 'bg-[#120B24] border-purple-900/40' : 'bg-white border-purple-100 shadow-sm'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center mb-4">
              <Zap size={22} />
            </div>
            <h3 className="text-base font-bold mb-2">Más rápido que Collectr</h3>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Agrega cartas a tu portafolio en 1 clic. Sin menús confusos ni pasos innecesarios. Define condición, precio pagado y si está lista para intercambio al instante.
            </p>
          </div>

          <div
            className={`p-6 rounded-2xl border ${
              isDark ? 'bg-[#120B24] border-purple-900/40' : 'bg-white border-purple-100 shadow-sm'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center mb-4">
              <DollarSign size={22} />
            </div>
            <h3 className="text-base font-bold mb-2">Precios Duales USD y MXN</h3>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              El mercado internacional se cotiza en USD, pero las compras y trades en México son en pesos. Visualiza ambos valores simultáneamente con tasa de cambio en vivo.
            </p>
          </div>

          <div
            className={`p-6 rounded-2xl border ${
              isDark ? 'bg-[#120B24] border-purple-900/40' : 'bg-white border-purple-100 shadow-sm'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center mb-4">
              <ShieldCheck size={22} />
            </div>
            <h3 className="text-base font-bold mb-2">Tienda & Tratos Seguros</h3>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Compra singles autenticados, cajas selladas y accesorios de nuestra tienda física. Además, usa la Mesa de Trade para calcular si un intercambio es justo.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
