import React, { useState } from 'react';
import { Card, PortfolioItem, Currency, ThemeMode } from '../types';
import { formatPrice } from '../utils/currency';
import {
  ArrowLeftRight,
  Plus,
  Trash2,
  Scale,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

interface TradeViewProps {
  portfolio: PortfolioItem[];
  allCards: Card[];
  currency: Currency;
  theme: ThemeMode;
  exchangeRate?: number;
}

export const TradeView: React.FC<TradeViewProps> = ({
  portfolio,
  allCards,
  currency,
  theme,
  exchangeRate = 18.65,
}) => {
  const isDark = theme === 'dark';

  // Trade Desk items
  const [sideACards, setSideACards] = useState<{ card: Card; quantity: number }[]>([]);
  const [sideBCards, setSideBCards] = useState<{ card: Card; quantity: number }[]>([]);

  // Selected cards for adding
  const [selectedSideAId, setSelectedSideAId] = useState<string>('');
  const [selectedSideBId, setSelectedSideBId] = useState<string>('');

  // Total valuations
  const totalSideAUsd = sideACards.reduce((acc, item) => acc + item.card.priceUsd * item.quantity, 0);
  const totalSideBUsd = sideBCards.reduce((acc, item) => acc + item.card.priceUsd * item.quantity, 0);

  const diffUsd = totalSideAUsd - totalSideBUsd;
  const absDiffUsd = Math.abs(diffUsd);
  const percentDiff = totalSideBUsd > 0 ? (absDiffUsd / totalSideBUsd) * 100 : 0;

  const isFair = totalSideAUsd > 0 && totalSideBUsd > 0 && percentDiff <= 5;

  const handleAddSideA = (cardId: string) => {
    if (!cardId) return;
    const foundCard = allCards.find((c) => c.id === cardId);
    if (!foundCard) return;

    setSideACards((prev) => {
      const existing = prev.find((item) => item.card.id === cardId);
      if (existing) {
        return prev.map((item) => (item.card.id === cardId ? { ...item, quantity: item.quantity + 1 } : item));
      }
      return [...prev, { card: foundCard, quantity: 1 }];
    });
    setSelectedSideAId('');
  };

  const handleAddSideB = (cardId: string) => {
    if (!cardId) return;
    const foundCard = allCards.find((c) => c.id === cardId);
    if (!foundCard) return;

    setSideBCards((prev) => {
      const existing = prev.find((item) => item.card.id === cardId);
      if (existing) {
        return prev.map((item) => (item.card.id === cardId ? { ...item, quantity: item.quantity + 1 } : item));
      }
      return [...prev, { card: foundCard, quantity: 1 }];
    });
    setSelectedSideBId('');
  };

  const handleRemoveSideA = (id: string) => {
    setSideACards((prev) => prev.filter((item) => item.card.id !== id));
  };

  const handleRemoveSideB = (id: string) => {
    setSideBCards((prev) => prev.filter((item) => item.card.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-6 pb-20">
      {/* Header */}
      <div className="pt-2 text-center max-w-2xl mx-auto space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
          <Scale size={13} />
          <span>Calculadora de Intercambio Justo</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
          Mesa de Trade Venus Vault
        </h1>
        <p className="text-xs text-slate-500">
          Compara el valor de mercado real entre tus cartas y las de otro coleccionista para asegurar acuerdos equilibrados.
        </p>
      </div>

      {/* Trade Verdict Card */}
      {(totalSideAUsd > 0 || totalSideBUsd > 0) && (
        <div
          className={`p-5 rounded-2xl border text-center ${
            isFair
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
              : diffUsd > 0
              ? isDark
                ? 'bg-indigo-950/30 border-indigo-800/40 text-indigo-200'
                : 'bg-indigo-50 border-indigo-200 text-indigo-900'
              : isDark
              ? 'bg-amber-950/20 border-amber-800/40 text-amber-300'
              : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}
        >
          <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider mb-1">
            {isFair ? (
              <>
                <CheckCircle size={16} className="text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400">Intercambio Balanceado</span>
              </>
            ) : diffUsd > 0 ? (
              <>
                <Scale size={16} className="text-indigo-500" />
                <span>Tu propuesta supera en valor a la otra parte</span>
              </>
            ) : (
              <>
                <Scale size={16} className="text-amber-500" />
                <span>La otra parte ofrece mayor valor</span>
              </>
            )}
          </div>

          <div className="text-xl sm:text-2xl font-black">
            Diferencia:{' '}
            <span className={diffUsd > 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-amber-600 dark:text-amber-400'}>
              {formatPrice(absDiffUsd, currency, false, exchangeRate).primary}
            </span>
          </div>

          <p className="text-xs mt-1 text-slate-600 dark:text-slate-400">
            {isFair
              ? 'La diferencia de valor es menor al 5%. Intercambio equitativo para ambas partes.'
              : diffUsd > 0
              ? `Para igualar el valor, la otra persona debería aportar ${formatPrice(absDiffUsd, currency, false, exchangeRate).primary} en efectivo o añadir otra carta.`
              : `Para igualar el valor, deberías compensar con ${formatPrice(absDiffUsd, currency, false, exchangeRate).primary} en efectivo o añadir otra carta.`}
          </p>
        </div>
      )}

      {/* Two Column Trade Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Side A: Tus Cartas */}
        <div
          className={`p-5 rounded-2xl border flex flex-col justify-between ${
            isDark ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Lado A (Tus Cartas)
                </span>
                <h3 className="text-base font-black text-slate-900 dark:text-white">Tu Oferta</h3>
              </div>
              <div className="text-right">
                <span className="text-lg font-black text-slate-900 dark:text-white">
                  {formatPrice(totalSideAUsd, currency, false, exchangeRate).primary}
                </span>
                <span className="text-[11px] block text-slate-500">
                  {formatPrice(totalSideAUsd, currency, false, exchangeRate).secondary}
                </span>
              </div>
            </div>

            {/* Quick add dropdown for Side A */}
            <div className="flex items-center gap-2">
              <select
                value={selectedSideAId}
                onChange={(e) => {
                  setSelectedSideAId(e.target.value);
                  handleAddSideA(e.target.value);
                }}
                className="w-full px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0b0f19] text-slate-800 dark:text-slate-200 outline-none cursor-pointer"
              >
                <option value="">+ Añadir carta a tu propuesta...</option>
                <optgroup label="Tus cartas en Portafolio">
                  {portfolio.map((p) => (
                    <option key={p.id} value={p.card.id}>
                      {p.card.name} ({p.condition}) - ${p.card.priceUsd} USD
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Otras cartas del Catálogo">
                  {allCards.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} - ${c.priceUsd} USD
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            {/* Items List */}
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {sideACards.length === 0 ? (
                <div className="py-10 text-center text-xs text-slate-400">
                  Aún no has agregado cartas a tu propuesta.
                </div>
              ) : (
                sideACards.map((item) => (
                  <div
                    key={item.card.id}
                    className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-[#0b0f19] flex items-center justify-between gap-2 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={item.card.image}
                        alt={item.card.name}
                        referrerPolicy="no-referrer"
                        className="w-9 h-12 object-contain rounded bg-black/5"
                      />
                      <div className="min-w-0">
                        <h4 className="font-bold truncate text-slate-900 dark:text-white">{item.card.name}</h4>
                        <span className="text-[10px] text-slate-400 block truncate">
                          {item.card.set} • #{item.card.cardNumber}
                        </span>
                        <span className="font-black text-indigo-600 dark:text-indigo-400">
                          {formatPrice(item.card.priceUsd * item.quantity, currency, false, exchangeRate).primary}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-bold px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        x{item.quantity}
                      </span>
                      <button
                        onClick={() => handleRemoveSideA(item.card.id)}
                        className="text-slate-400 hover:text-rose-500"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Side B: Cartas de la Otra Parte */}
        <div
          className={`p-5 rounded-2xl border flex flex-col justify-between ${
            isDark ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Lado B (Otra Parte)
                </span>
                <h3 className="text-base font-black text-slate-900 dark:text-white">Lo Que Recibes</h3>
              </div>
              <div className="text-right">
                <span className="text-lg font-black text-slate-900 dark:text-white">
                  {formatPrice(totalSideBUsd, currency, false, exchangeRate).primary}
                </span>
                <span className="text-[11px] block text-slate-500">
                  {formatPrice(totalSideBUsd, currency, false, exchangeRate).secondary}
                </span>
              </div>
            </div>

            {/* Quick add dropdown for Side B */}
            <div className="flex items-center gap-2">
              <select
                value={selectedSideBId}
                onChange={(e) => {
                  setSelectedSideBId(e.target.value);
                  handleAddSideB(e.target.value);
                }}
                className="w-full px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0b0f19] text-slate-800 dark:text-slate-200 outline-none cursor-pointer"
              >
                <option value="">+ Añadir carta deseada...</option>
                {allCards.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.game === 'pokemon' ? 'PKMN' : 'OP'}) - ${c.priceUsd} USD
                  </option>
                ))}
              </select>
            </div>

            {/* Items List */}
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {sideBCards.length === 0 ? (
                <div className="py-10 text-center text-xs text-slate-400">
                  Añade las cartas que te ofrecen o te interesan para calcular.
                </div>
              ) : (
                sideBCards.map((item) => (
                  <div
                    key={item.card.id}
                    className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-[#0b0f19] flex items-center justify-between gap-2 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={item.card.image}
                        alt={item.card.name}
                        referrerPolicy="no-referrer"
                        className="w-9 h-12 object-contain rounded bg-black/5"
                      />
                      <div className="min-w-0">
                        <h4 className="font-bold truncate text-slate-900 dark:text-white">{item.card.name}</h4>
                        <span className="text-[10px] text-slate-400 block truncate">
                          {item.card.set} • #{item.card.cardNumber}
                        </span>
                        <span className="font-black text-indigo-600 dark:text-indigo-400">
                          {formatPrice(item.card.priceUsd * item.quantity, currency, false, exchangeRate).primary}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-bold px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        x{item.quantity}
                      </span>
                      <button
                        onClick={() => handleRemoveSideB(item.card.id)}
                        className="text-slate-400 hover:text-rose-500"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
