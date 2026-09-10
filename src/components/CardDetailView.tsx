import React, { useState } from 'react';
import { Card, Currency, ThemeMode, CardCondition } from '../types';
import { formatPrice, formatChange } from '../utils/currency';
import { calculateAdjustedPrice } from '../services/currencyService';
import {
  ArrowLeft,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  Plus,
  ShoppingCart,
  ArrowRightLeft,
  Check,
  Layers,
  Calendar,
  Sparkles,
  Info,
} from 'lucide-react';

interface CardDetailViewProps {
  card: Card;
  onBack: () => void;
  onQuickAdd: (card: Card) => void;
  onAddToCart?: (card: Card) => void;
  onAddToTrade?: (card: Card, side: 'user' | 'target') => void;
  currency: Currency;
  theme: ThemeMode;
  exchangeRate: number;
}

export const CardDetailView: React.FC<CardDetailViewProps> = ({
  card,
  onBack,
  onQuickAdd,
  onAddToCart,
  onAddToTrade,
  currency,
  theme,
  exchangeRate,
}) => {
  const isDark = theme === 'dark';
  const [selectedCondition, setSelectedCondition] = useState<CardCondition>('NM');
  const [isAddedToPortfolio, setIsAddedToPortfolio] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  const adjustedPriceUsd = calculateAdjustedPrice(card.priceUsd, selectedCondition);
  const priceDisplay = formatPrice(adjustedPriceUsd, currency, true, exchangeRate);
  const change24 = formatChange(card.change24h);
  const change7 = formatChange(card.change7d);

  // Conditions table
  const conditions: { id: CardCondition; label: string; multiplier: number; quality: string }[] = [
    { id: 'PSA 10', label: 'PSA 10 Gem Mint', multiplier: 2.25, quality: 'Graduada perfecta' },
    { id: 'PSA 9', label: 'PSA 9 Mint', multiplier: 1.35, quality: 'Graduada excelente' },
    { id: 'BGS 9.5', label: 'BGS 9.5 Gem Mint', multiplier: 1.85, quality: 'Beckett Subgrades' },
    { id: 'NM', label: 'Near Mint (NM)', multiplier: 1.0, quality: 'Sin uso visible / Empacada' },
    { id: 'LP', label: 'Lightly Played (LP)', multiplier: 0.85, quality: 'Leves marcas de baraja' },
    { id: 'MP', label: 'Moderately Played (MP)', multiplier: 0.7, quality: 'Desgaste moderado' },
    { id: 'HP', label: 'Heavily Played (HP)', multiplier: 0.5, quality: 'Marcas y dobleces' },
  ];

  // SVG Chart calculation for historical prices
  const history = card.priceHistory;
  const minPrice = Math.min(...history.map((h) => h.usd)) * 0.95;
  const maxPrice = Math.max(...history.map((h) => h.usd)) * 1.05;
  const range = maxPrice - minPrice || 1;

  const chartPoints = history
    .map((h, i) => {
      const x = (i / (history.length - 1)) * 480 + 20;
      const y = 160 - ((h.usd - minPrice) / range) * 120;
      return `${x},${y}`;
    })
    .join(' ');

  const handleAddPortfolio = () => {
    onQuickAdd(card);
    setIsAddedToPortfolio(true);
    setTimeout(() => setIsAddedToPortfolio(false), 2000);
  };

  const handleBuyNow = () => {
    if (onAddToCart) {
      onAddToCart(card);
      setIsAddedToCart(true);
      setTimeout(() => setIsAddedToCart(false), 2000);
    }
  };

  const handleOpenExternalWindow = () => {
    const cardDataString = encodeURIComponent(JSON.stringify({
      id: card.id,
      name: card.name,
      priceUsd: card.priceUsd,
      image: card.image,
      set: card.set,
      cardNumber: card.cardNumber,
    }));
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${card.name} - Venus Vault</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/mfd/f3d96ec7f0e30e49564cb0b520480d1b/gilroy.css">
          <style>
            body {
              margin: 0;
              padding: 24px;
              background-color: #0b0f19;
              color: #f8fafc;
              font-family: 'Gilroy', -apple-system, BlinkMacSystemFont, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              box-sizing: border-box;
            }
            .card-wrapper {
              max-width: 640px;
              width: 100%;
              background: #111827;
              border: 1px solid #1f293d;
              border-radius: 24px;
              padding: 32px;
              box-shadow: 0 20px 40px rgba(0,0,0,0.5);
              text-align: center;
            }
            img {
              max-width: 280px;
              height: auto;
              border-radius: 12px;
              margin: 20px auto;
              box-shadow: 0 10px 25px rgba(0,0,0,0.6);
            }
            .tag {
              display: inline-block;
              padding: 4px 12px;
              border-radius: 6px;
              font-size: 12px;
              font-weight: 700;
              background: rgba(99, 102, 241, 0.2);
              color: #818cf8;
              margin-bottom: 12px;
            }
            h1 { font-size: 24px; margin: 8px 0; font-weight: 800; }
            .set-meta { color: #94a3b8; font-size: 14px; margin-bottom: 20px; }
            .price { font-size: 32px; font-weight: 900; color: #818cf8; margin-bottom: 8px; }
            .currency-note { color: #64748b; font-size: 13px; }
            button {
              margin-top: 24px;
              padding: 12px 28px;
              background: #6366f1;
              color: white;
              border: none;
              border-radius: 12px;
              font-weight: 700;
              cursor: pointer;
            }
          </style>
        </head>
        <body>
          <div class="card-wrapper">
            <span class="tag">${card.game.toUpperCase()} • ${card.rarity}</span>
            <h1>${card.name}</h1>
            <div class="set-meta">${card.set} • ${card.cardNumber} • ${card.language}</div>
            <img src="${card.image}" alt="${card.name}" />
            <div class="price">$${card.priceUsd.toFixed(2)} USD</div>
            <div class="currency-note">Cotización oficial Venus Vault</div>
            <br/>
            <button onclick="window.close()">Cerrar Ventana</button>
          </div>
        </body>
        </html>
      `);
      newWindow.document.close();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-24">
      {/* Top Breadcrumbs & Window Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={onBack}
          className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors ${
            isDark
              ? 'bg-slate-800/80 hover:bg-slate-700 text-slate-200'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
          }`}
        >
          <ArrowLeft size={16} />
          <span>Volver al Catálogo</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Open in separate browser window button */}
          <button
            onClick={handleOpenExternalWindow}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors ${
              isDark
                ? 'border-slate-700 text-slate-300 hover:bg-slate-800'
                : 'border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
            title="Abrir ficha técnica en una nueva ventana de navegador"
          >
            <ExternalLink size={14} />
            <span className="hidden sm:inline">Abrir en Nueva Ventana</span>
            <span className="sm:hidden">Nueva Ventana</span>
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Artwork, Quick Badges & High-Res Inspection */}
        <div className="lg:col-span-5 space-y-4">
          <div
            className={`rounded-3xl p-6 sm:p-8 border flex flex-col items-center justify-center relative overflow-hidden transition-all ${
              isDark
                ? 'bg-[#111827] border-slate-800 shadow-xl'
                : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            {/* Top Badges */}
            <div className="w-full flex items-center justify-between gap-2 mb-4">
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider ${
                  card.game === 'pokemon'
                    ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                    : card.game === 'onepiece'
                    ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                    : 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400'
                }`}
              >
                {card.game === 'pokemon' ? 'Pokémon TCG' : card.game === 'onepiece' ? 'One Piece TCG' : card.game}
              </span>

              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
                  isDark ? 'border-slate-700 text-slate-300 bg-slate-800' : 'border-slate-200 text-slate-700 bg-slate-50'
                }`}
              >
                Idioma: {card.language}
              </span>
            </div>

            {/* High Res Artwork */}
            <div className="relative aspect-[3/4] w-full max-w-[320px] flex items-center justify-center my-2">
              <img
                src={card.image}
                alt={card.name}
                referrerPolicy="no-referrer"
                className="max-h-[420px] w-auto object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-300 rounded-lg"
              />
            </div>

            {/* Verified Authentic Badge */}
            <div
              className={`mt-4 w-full py-2 px-3 rounded-xl flex items-center justify-center gap-2 text-xs font-semibold ${
                isDark ? 'bg-slate-800/60 text-slate-300' : 'bg-slate-100 text-slate-700'
              }`}
            >
              <ShieldCheck size={16} className="text-emerald-500" />
              <span>Autenticidad Garantizada por Venus Vault</span>
            </div>
          </div>

          {/* Quick Specifications */}
          <div
            className={`rounded-2xl p-4 border text-xs space-y-2.5 ${
              isDark ? 'bg-[#111827] border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
            }`}
          >
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Expansión</span>
              <span className="font-bold">{card.set}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Código de Set</span>
              <span className="font-bold font-mono">{card.setCode}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Número de Carta</span>
              <span className="font-bold">{card.cardNumber}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Rareza</span>
              <span className="font-bold">{card.rarity}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Año de Lanzamiento</span>
              <span className="font-bold">{card.releaseYear}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Pricing, Conditions, Live History & Direct Actions */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card Header & Title */}
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <span>{card.set}</span>
              <span>•</span>
              <span>#{card.cardNumber}</span>
              <span>•</span>
              <span className="font-medium text-indigo-600 dark:text-indigo-400">{card.rarity}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {card.name}
            </h1>
          </div>

          {/* Pricing Box (Collectr Style) */}
          <div
            className={`p-5 rounded-3xl border ${
              isDark ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  Precio de Mercado ({selectedCondition})
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                    {priceDisplay.primary}
                  </span>
                  {priceDisplay.secondary && (
                    <span className="text-base font-semibold text-slate-500">
                      ({priceDisplay.secondary})
                    </span>
                  )}
                </div>
              </div>

              {/* 24h & 7d Changes */}
              <div className="flex items-center gap-2">
                <div
                  className={`px-3 py-1.5 rounded-xl flex items-center gap-1 text-xs font-bold ${
                    change24.isPositive
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                      : 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {change24.isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  <span>{change24.text} (24h)</span>
                </div>
                <div
                  className={`px-3 py-1.5 rounded-xl flex items-center gap-1 text-xs font-bold ${
                    change7.isPositive
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                      : 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {change7.isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  <span>{change7.text} (7d)</span>
                </div>
              </div>
            </div>

            {/* Action Buttons: Add to Portfolio & Online Purchase */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={handleAddPortfolio}
                className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  isAddedToPortfolio
                    ? 'bg-emerald-600 text-white'
                    : isDark
                    ? 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300'
                }`}
              >
                {isAddedToPortfolio ? (
                  <>
                    <Check size={16} />
                    <span>¡Agregada al Portafolio!</span>
                  </>
                ) : (
                  <>
                    <Plus size={16} />
                    <span>Añadir a mi Portafolio</span>
                  </>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  isAddedToCart
                    ? 'bg-emerald-600 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm'
                }`}
              >
                {isAddedToCart ? (
                  <>
                    <Check size={16} />
                    <span>Agregado al Carrito</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart size={16} />
                    <span>Comprar en Línea</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Condition Matrix (Collectr Style) */}
          <div
            className={`p-5 rounded-3xl border ${
              isDark ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Valoración por Grado y Condición
              </h3>
              <span className="text-[11px] text-slate-500">Selecciona para recalcular</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {conditions.map((c) => {
                const cPriceUsd = calculateAdjustedPrice(card.priceUsd, c.id);
                const cPrice = formatPrice(cPriceUsd, currency, false, exchangeRate);
                const isSelected = selectedCondition === c.id;

                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCondition(c.id)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-500/10 ring-1 ring-indigo-500'
                        : isDark
                        ? 'border-slate-800 hover:border-slate-700 bg-slate-800/40'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/70'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">{c.label}</span>
                      {isSelected && <Check size={12} className="text-indigo-500" />}
                    </div>
                    <span className="text-sm font-black text-slate-900 dark:text-slate-100 block mt-1">
                      {cPrice.primary}
                    </span>
                    <span className="text-[10px] text-slate-500 block truncate">{c.quality}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Historical Price Chart (Collectr Clean Line Chart) */}
          <div
            className={`p-5 rounded-3xl border ${
              isDark ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Historial de Precio Referencial
                </h3>
                <span className="text-[11px] text-slate-500">Últimos 30 días de transacciones verificadas</span>
              </div>
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                1 USD = ${exchangeRate.toFixed(2)} MXN
              </span>
            </div>

            {/* SVG Chart */}
            <div className="relative h-44 w-full pt-2">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 520 180" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid guidelines */}
                <line x1="20" y1="40" x2="500" y2="40" stroke={isDark ? '#1e293b' : '#f1f5f9'} strokeDasharray="3 3" />
                <line x1="20" y1="100" x2="500" y2="100" stroke={isDark ? '#1e293b' : '#f1f5f9'} strokeDasharray="3 3" />
                <line x1="20" y1="160" x2="500" y2="160" stroke={isDark ? '#1e293b' : '#f1f5f9'} />

                {/* Area fill */}
                <polygon
                  points={`20,160 ${chartPoints} 500,160`}
                  fill="url(#chartGradient)"
                />

                {/* Main line */}
                <polyline
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={chartPoints}
                />

                {/* Data points */}
                {history.map((h, i) => {
                  const x = (i / (history.length - 1)) * 480 + 20;
                  const y = 160 - ((h.usd - minPrice) / range) * 120;
                  return (
                    <g key={i}>
                      <circle cx={x} cy={y} r="4" fill="#6366f1" stroke={isDark ? '#111827' : '#ffffff'} strokeWidth="2" />
                    </g>
                  );
                })}
              </svg>

              {/* Chart Dates Axis */}
              <div className="flex justify-between text-[10px] text-slate-500 mt-2 px-1">
                {history.map((h, i) => (
                  <span key={i}>{h.date}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
