import React, { useState } from 'react';
import { Card, CardCondition, PortfolioItem, Currency, ThemeMode } from '../types';
import { formatPrice } from '../utils/currency';
import { Check, Plus, Minus, X, ArrowRight } from 'lucide-react';

interface QuickAddModalProps {
  card: Card | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToPortfolio: (item: Omit<PortfolioItem, 'id'>) => void;
  currency: Currency;
  theme: ThemeMode;
  exchangeRate?: number;
}

const CONDITIONS: { label: string; value: CardCondition; desc: string }[] = [
  { label: 'NM', value: 'NM', desc: 'Near Mint (Casi nueva)' },
  { label: 'LP', value: 'LP', desc: 'Lightly Played (Poco uso)' },
  { label: 'MP', value: 'MP', desc: 'Moderately Played' },
  { label: 'HP', value: 'HP', desc: 'Heavily Played' },
  { label: 'PSA 10', value: 'PSA 10', desc: 'Gem Mint Certificada' },
  { label: 'PSA 9', value: 'PSA 9', desc: 'Mint Certificada' },
];

export const QuickAddModal: React.FC<QuickAddModalProps> = ({
  card,
  isOpen,
  onClose,
  onAddToPortfolio,
  currency,
  theme,
  exchangeRate = 18.65,
}) => {
  if (!card || !isOpen) return null;

  const isDark = theme === 'dark';
  const [quantity, setQuantity] = useState(1);
  const [condition, setCondition] = useState<CardCondition>('NM');
  const [purchasePriceUsd, setPurchasePriceUsd] = useState(card.priceUsd);
  const [isForTrade, setIsForTrade] = useState(false);
  const [notes, setNotes] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const priceDisplay = formatPrice(purchasePriceUsd, currency, false, exchangeRate);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddToPortfolio({
      cardId: card.id,
      card,
      quantity,
      condition,
      purchasePriceUsd: Number(purchasePriceUsd) || card.priceUsd,
      purchaseDate: new Date().toISOString().split('T')[0],
      isForTrade,
      notes: notes.trim() || undefined,
      isGraded: condition.startsWith('PSA') || condition.startsWith('BGS'),
      gradeCompany: condition.startsWith('PSA') ? 'PSA' : undefined,
      gradeScore: condition === 'PSA 10' ? 10 : condition === 'PSA 9' ? 9 : undefined,
    });

    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      onClose();
      setQuantity(1);
      setCondition('NM');
      setPurchasePriceUsd(card.priceUsd);
      setIsForTrade(false);
      setNotes('');
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div
        className={`relative w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl border ${
          isDark
            ? 'bg-[#111827] border-slate-800 text-white'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className="px-5 py-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
              Añadir a mi Portafolio
            </h3>
            <p className="text-xs text-slate-500">
              Registra tu carta para calcular su valorización
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {showSuccess ? (
          <div className="p-10 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
              <Check size={26} className="stroke-[3]" />
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              Guardada en Portafolio
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              {quantity}x {card.name} ({condition}) añadido con éxito
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {/* Card Summary Badge */}
            <div className="p-3 rounded-xl flex items-center gap-3 border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-[#0b0f19]">
              <img
                src={card.image}
                alt={card.name}
                referrerPolicy="no-referrer"
                className="w-10 h-14 object-contain rounded bg-black/5"
              />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold uppercase text-slate-500">
                  {card.game === 'pokemon' ? 'Pokémon TCG' : 'One Piece TCG'}
                </span>
                <h4 className="text-xs font-bold truncate text-slate-900 dark:text-white mt-0.5">
                  {card.name}
                </h4>
                <div className="flex items-center gap-2 mt-0.5 text-xs">
                  <span className="text-slate-400">{card.set} • #{card.cardNumber}</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-semibold">• Mercado: {priceDisplay.primary}</span>
                </div>
              </div>
            </div>

            {/* Condition Selector */}
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-slate-700 dark:text-slate-300">
                Condición de la Carta:
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                {CONDITIONS.map((c) => {
                  const isSelected = condition === c.value;
                  return (
                    <button
                      type="button"
                      key={c.value}
                      onClick={() => setCondition(c.value)}
                      className={`px-2 py-1.5 text-center rounded-xl text-xs font-bold border transition-colors ${
                        isSelected
                          ? 'bg-indigo-600 border-indigo-600 text-white'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0b0f19] text-slate-700 dark:text-slate-300'
                      }`}
                      title={c.desc}
                    >
                      {c.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity and Purchase Price Row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1.5 text-slate-700 dark:text-slate-300">
                  Cantidad:
                </label>
                <div className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0b0f19] p-1">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="font-bold text-sm px-2 text-slate-900 dark:text-white">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Precio Pagado (USD):
                  </label>
                  <button
                    type="button"
                    onClick={() => setPurchasePriceUsd(card.priceUsd)}
                    className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
                  >
                    Usar Mercado
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={purchasePriceUsd}
                    onChange={(e) => setPurchasePriceUsd(parseFloat(e.target.value) || 0)}
                    className="w-full pl-6 pr-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Trade status toggle */}
            <div
              className={`p-3 rounded-xl flex items-center justify-between border cursor-pointer transition-colors ${
                isForTrade
                  ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-900 dark:text-indigo-200'
                  : 'bg-slate-50 dark:bg-[#0b0f19] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
              }`}
              onClick={() => setIsForTrade(!isForTrade)}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                    isForTrade
                      ? 'bg-indigo-600 border-indigo-600 text-white'
                      : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900'
                  }`}
                >
                  {isForTrade && <Check size={12} className="stroke-[3]" />}
                </div>
                <div>
                  <span className="text-xs font-bold block">Marcar para Intercambio (Trade Binder)</span>
                  <p className="text-[10px] text-slate-400">
                    Estará disponible en la calculadora de intercambios
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <span>Guardar en Portafolio</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
