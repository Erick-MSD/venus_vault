import React, { useState, useEffect, useRef } from 'react';
import { Card, Currency, ThemeMode } from '../types';
import { formatPrice } from '../utils/currency';
import { Search, Plus, X } from 'lucide-react';

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  cards: Card[];
  onSelectCard: (card: Card) => void;
  onQuickAdd: (card: Card) => void;
  currency: Currency;
  theme: ThemeMode;
  exchangeRate?: number;
}

export const QuickSearchModal: React.FC<QuickSearchModalProps> = ({
  isOpen,
  onClose,
  cards,
  onSelectCard,
  onQuickAdd,
  currency,
  theme,
  exchangeRate = 18.65,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGame, setSelectedGame] = useState<'all' | 'pokemon' | 'onepiece'>('all');
  const inputRef = useRef<HTMLInputElement>(null);
  const isDark = theme === 'dark';

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setSearchTerm('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredCards = cards.filter((c) => {
    const matchesGame = selectedGame === 'all' || c.game === selectedGame;
    const term = searchTerm.toLowerCase().trim();
    if (!term) return matchesGame;
    return (
      matchesGame &&
      (c.name.toLowerCase().includes(term) ||
        c.set.toLowerCase().includes(term) ||
        c.cardNumber.toLowerCase().includes(term) ||
        c.rarity.toLowerCase().includes(term))
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-xs">
      <div
        className={`relative w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl border ${
          isDark
            ? 'bg-[#111827] border-slate-800 text-white'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Search Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <Search size={18} className="text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Buscar carta (ej. Charizard, Luffy, Umbreon, Shanks)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent outline-none text-sm font-medium placeholder-slate-400"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Game Quick Filter Tabs */}
        <div className="px-4 py-2 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-[#0b0f19] text-xs">
          <span className="text-[11px] font-semibold text-slate-400">Filtrar:</span>
          <button
            onClick={() => setSelectedGame('all')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
              selectedGame === 'all'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setSelectedGame('pokemon')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
              selectedGame === 'pokemon'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Pokémon
          </button>
          <button
            onClick={() => setSelectedGame('onepiece')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
              selectedGame === 'onepiece'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            One Piece
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2 divide-y divide-slate-100 dark:divide-slate-800">
          {filteredCards.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No se encontraron cartas que coincidan con tu búsqueda.
            </div>
          ) : (
            filteredCards.map((card) => {
              const price = formatPrice(card.priceUsd, currency, false, exchangeRate);
              return (
                <div
                  key={card.id}
                  className="py-2.5 px-3 rounded-xl flex items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <div
                    onClick={() => {
                      onSelectCard(card);
                      onClose();
                    }}
                    className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                  >
                    <img
                      src={card.image}
                      alt={card.name}
                      referrerPolicy="no-referrer"
                      className="w-9 h-12 object-contain rounded bg-black/5 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {card.game}
                        </span>
                        <span className="text-[11px] truncate text-slate-400">
                          {card.set} • #{card.cardNumber}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold truncate mt-0.5 text-slate-900 dark:text-white">
                        {card.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-black text-slate-900 dark:text-white">
                          {price.primary}
                        </span>
                        {price.secondary && (
                          <span className="text-[10px] text-slate-400">{price.secondary}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onQuickAdd(card);
                      onClose();
                    }}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 flex items-center gap-1 shrink-0"
                    title="Añadir a mi portafolio"
                  >
                    <Plus size={14} />
                    <span className="hidden sm:inline">Portafolio</span>
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
