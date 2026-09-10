import React, { useState, useMemo } from 'react';
import { PortfolioItem, Currency, ThemeMode } from '../types';
import { formatPrice, formatChange } from '../utils/currency';
import {
  Briefcase,
  TrendingUp,
  TrendingDown,
  Plus,
  Search,
  Trash2,
  ArrowLeftRight,
  Download,
  LayoutGrid,
  List,
  Layers,
  Sparkles,
} from 'lucide-react';

interface PortfolioViewProps {
  portfolio: PortfolioItem[];
  onUpdateQuantity: (id: string, newQty: number) => void;
  onRemoveItem: (id: string) => void;
  onToggleTrade: (id: string) => void;
  onOpenQuickSearch: () => void;
  currency: Currency;
  theme: ThemeMode;
  exchangeRate?: number;
}

export const PortfolioView: React.FC<PortfolioViewProps> = ({
  portfolio,
  onUpdateQuantity,
  onRemoveItem,
  onToggleTrade,
  onOpenQuickSearch,
  currency,
  theme,
  exchangeRate = 18.65,
}) => {
  const isDark = theme === 'dark';
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGame, setFilterGame] = useState<'all' | 'pokemon' | 'onepiece'>('all');
  const [filterTradeOnly, setFilterTradeOnly] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Financial calculations
  const { totalValueUsd, totalCostUsd, totalCardsCount, topCard } = useMemo(() => {
    let valueUsd = 0;
    let costUsd = 0;
    let cardsCount = 0;
    let highestCard: PortfolioItem | null = null;

    portfolio.forEach((item) => {
      const itemCurrentVal = item.card.priceUsd * item.quantity;
      const itemCost = item.purchasePriceUsd * item.quantity;

      valueUsd += itemCurrentVal;
      costUsd += itemCost;
      cardsCount += item.quantity;

      if (!highestCard || item.card.priceUsd > highestCard.card.priceUsd) {
        highestCard = item;
      }
    });

    return {
      totalValueUsd: valueUsd,
      totalCostUsd: costUsd,
      totalCardsCount: cardsCount,
      topCard: highestCard,
    };
  }, [portfolio]);

  const totalProfitUsd = totalValueUsd - totalCostUsd;
  const profitPercentage = totalCostUsd > 0 ? (totalProfitUsd / totalCostUsd) * 100 : 0;
  const profitFormatted = formatChange(profitPercentage);

  // Filtered portfolio
  const filteredPortfolio = useMemo(() => {
    return portfolio.filter((item) => {
      if (filterGame !== 'all' && item.card.game !== filterGame) return false;
      if (filterTradeOnly && !item.isForTrade) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = item.card.name.toLowerCase().includes(q);
        const matchSet = item.card.set.toLowerCase().includes(q);
        const matchNotes = item.notes?.toLowerCase().includes(q);
        if (!matchName && !matchSet && !matchNotes) return false;
      }
      return true;
    });
  }, [portfolio, filterGame, filterTradeOnly, searchQuery]);

  const handleExportCsv = () => {
    const headers = [
      'Carta',
      'Juego',
      'Set',
      'Numero',
      'Condicion',
      'Cantidad',
      'Precio Mercado USD',
      'Precio Pagado USD',
      'Para Trade',
      'Notas',
    ];
    const rows = portfolio.map((p) => [
      `"${p.card.name}"`,
      p.card.game,
      `"${p.card.set}"`,
      p.card.cardNumber,
      p.condition,
      p.quantity,
      p.card.priceUsd,
      p.purchasePriceUsd,
      p.isForTrade ? 'SI' : 'NO',
      `"${p.notes || ''}"`,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Venus_Vault_Portafolio_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-6 pb-20">
      {/* Portfolio Header & Analytics Cards */}
      <div className="pt-2 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                Mi Portafolio TCG
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold">
                Colección Activa
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Monitoreo del valor de tu colección en dólares y pesos mexicanos.
            </p>
          </div>

          {/* Quick action buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={onOpenQuickSearch}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 flex items-center gap-1.5 shadow-xs"
            >
              <Plus size={15} />
              <span>Agregar Carta</span>
            </button>
            <button
              onClick={handleExportCsv}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                isDark
                  ? 'border-slate-800 bg-[#111827] hover:bg-slate-800 text-slate-300'
                  : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
              }`}
              title="Exportar a CSV"
            >
              <Download size={14} />
              <span className="hidden sm:inline">Exportar CSV</span>
            </button>
          </div>
        </div>

        {/* Analytics 4-Grid Dashboard (Collectr Style) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Total Value */}
          <div
            className={`p-4 sm:p-5 rounded-2xl border flex flex-col justify-between ${
              isDark ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Valor Total Estimado
              </span>
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
                <Briefcase size={16} />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {formatPrice(totalValueUsd, currency, false, exchangeRate).primary}
              </span>
              <span className="text-xs block text-slate-500 mt-0.5">
                {formatPrice(totalValueUsd, currency, false, exchangeRate).secondary}
              </span>
            </div>
          </div>

          {/* Profit / Return */}
          <div
            className={`p-4 sm:p-5 rounded-2xl border flex flex-col justify-between ${
              isDark ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Rendimiento / Ganancia
              </span>
              <div
                className={`p-2 rounded-xl ${
                  profitFormatted.isPositive
                    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                    : 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                }`}
              >
                {profitFormatted.isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-2">
                <span
                  className={`text-xl sm:text-2xl font-black ${
                    profitFormatted.isPositive
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {formatPrice(Math.abs(totalProfitUsd), currency, false, exchangeRate).primary}
                </span>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                    profitFormatted.isPositive
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                      : 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {profitFormatted.text}
                </span>
              </div>
              <span className="text-xs block text-slate-500 mt-0.5">
                Costo base: {formatPrice(totalCostUsd, currency, false, exchangeRate).primary}
              </span>
            </div>
          </div>

          {/* Cards Count */}
          <div
            className={`p-4 sm:p-5 rounded-2xl border flex flex-col justify-between ${
              isDark ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Cartas Registradas
              </span>
              <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500">
                <Layers size={16} />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {totalCardsCount} unidades
              </span>
              <span className="text-xs block text-slate-500 mt-0.5">
                {portfolio.length} piezas únicas
              </span>
            </div>
          </div>

          {/* Top Card */}
          <div
            className={`p-4 sm:p-5 rounded-2xl border flex flex-col justify-between ${
              isDark ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Carta Más Valiosa
              </span>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                <Sparkles size={16} />
              </div>
            </div>
            <div className="mt-3">
              {topCard ? (
                <>
                  <span className="text-xs sm:text-sm font-bold block truncate text-slate-900 dark:text-white">
                    {topCard.card.name}
                  </span>
                  <span className="text-sm sm:text-base font-black text-indigo-600 dark:text-indigo-400 block mt-0.5">
                    {formatPrice(topCard.card.priceUsd, currency, false, exchangeRate).primary}
                  </span>
                </>
              ) : (
                <span className="text-xs text-slate-400">Sin cartas en bóveda</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Filter and View Bar */}
      <div
        className={`p-3 sm:p-4 rounded-2xl border flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 ${
          isDark ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}
      >
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Filtrar en mi colección..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl text-xs font-medium outline-none border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-white focus:border-indigo-500"
            />
          </div>

          <select
            value={filterGame}
            onChange={(e) => setFilterGame(e.target.value as any)}
            className="px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0b0f19] text-slate-800 dark:text-slate-200 outline-none cursor-pointer"
          >
            <option value="all">Todos los Juegos</option>
            <option value="pokemon">Pokémon TCG</option>
            <option value="onepiece">One Piece TCG</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterTradeOnly(!filterTradeOnly)}
            className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 ${
              filterTradeOnly
                ? 'bg-indigo-600 border-indigo-600 text-white'
                : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <ArrowLeftRight size={14} />
            <span>Para Intercambio</span>
          </button>

          <div className="flex items-center p-0.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0b0f19]">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-600'
              }`}
              title="Vista Cuadrícula"
            >
              <LayoutGrid size={15} />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'table' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-600'
              }`}
              title="Vista Tabla"
            >
              <List size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Collection Grid / List */}
      {filteredPortfolio.length === 0 ? (
        <div className="py-20 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] text-center space-y-3">
          <Briefcase size={28} className="mx-auto text-slate-400" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Tu portafolio está listo para llenarse
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Agrega tus cartas de Pokémon o One Piece en un solo clic desde el Catálogo de cartas.
          </p>
          <button
            onClick={onOpenQuickSearch}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500"
          >
            Buscar y Agregar Cartas
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {filteredPortfolio.map((item) => {
            const currentItemVal = item.card.priceUsd * item.quantity;
            const costItemVal = item.purchasePriceUsd * item.quantity;
            const gain = currentItemVal - costItemVal;
            const gainPct = costItemVal > 0 ? (gain / costItemVal) * 100 : 0;
            const price = formatPrice(currentItemVal, currency, false, exchangeRate);

            return (
              <div
                key={item.id}
                className={`rounded-2xl p-3 border transition-all flex flex-col justify-between ${
                  isDark
                    ? 'bg-[#111827] border-slate-800 hover:border-slate-700'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] mb-1.5">
                    <span className="font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {item.condition}
                    </span>

                    {item.isForTrade && (
                      <span className="font-bold uppercase px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[9px] flex items-center gap-1">
                        <ArrowLeftRight size={9} />
                        <span>Trade</span>
                      </span>
                    )}
                  </div>

                  <div className="aspect-[3/4] flex items-center justify-center py-1">
                    <img
                      src={item.card.image}
                      alt={item.card.name}
                      referrerPolicy="no-referrer"
                      className="max-h-44 w-auto object-contain rounded drop-shadow-sm hover:scale-102 transition-transform duration-200"
                    />
                  </div>

                  <div className="mt-2 space-y-1">
                    <span className="text-[10px] block truncate text-slate-400">
                      {item.card.set} • {item.card.cardNumber}
                    </span>
                    <h4 className="text-xs font-bold truncate text-slate-900 dark:text-white">
                      {item.card.name}
                    </h4>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                      {price.primary}
                    </span>
                    <span
                      className={`text-[10px] font-bold ${
                        gain >= 0
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {gain >= 0 ? '+' : ''}
                      {gainPct.toFixed(1)}%
                    </span>
                  </div>

                  {/* Quantity Stepper & Trade Toggle */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <div className="flex items-center border rounded-lg border-slate-200 dark:border-slate-800">
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white"
                      >
                        -
                      </button>
                      <span className="px-1.5 text-xs font-bold">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-slate-400 hover:text-rose-500"
                      title="Eliminar del portafolio"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] overflow-x-auto shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0e131f] text-[10px] font-bold uppercase text-slate-500">
              <tr>
                <th className="p-3">Carta</th>
                <th className="p-3">Juego / Set</th>
                <th className="p-3">Condición</th>
                <th className="p-3">Cant.</th>
                <th className="p-3">Precio Pagado</th>
                <th className="p-3">Valor Mercado</th>
                <th className="p-3">Ganancia</th>
                <th className="p-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredPortfolio.map((item) => {
                const totalMarket = item.card.priceUsd * item.quantity;
                const totalCost = item.purchasePriceUsd * item.quantity;
                const gain = totalMarket - totalCost;
                const gainPct = totalCost > 0 ? (gain / totalCost) * 100 : 0;

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="p-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={item.card.image}
                          alt={item.card.name}
                          referrerPolicy="no-referrer"
                          className="w-8 h-11 object-contain rounded bg-black/5"
                        />
                        <div>
                          <span className="font-bold block text-slate-900 dark:text-white">
                            {item.card.name}
                          </span>
                          <span className="text-[10px] text-slate-400">{item.card.cardNumber}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="font-semibold block text-slate-800 dark:text-slate-200">
                        {item.card.game === 'pokemon' ? 'Pokémon' : 'One Piece'}
                      </span>
                      <span className="text-[10px] text-slate-400">{item.card.set}</span>
                    </td>
                    <td className="p-3">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {item.condition}
                      </span>
                    </td>
                    <td className="p-3 font-bold">{item.quantity}</td>
                    <td className="p-3 text-slate-500">
                      {formatPrice(item.purchasePriceUsd, currency, false, exchangeRate).primary}
                    </td>
                    <td className="p-3 font-bold text-slate-900 dark:text-white">
                      {formatPrice(totalMarket, currency, false, exchangeRate).primary}
                    </td>
                    <td className="p-3">
                      <span
                        className={`font-bold ${
                          gain >= 0
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-rose-600 dark:text-rose-400'
                        }`}
                      >
                        {gain >= 0 ? '+' : ''}
                        {gainPct.toFixed(1)}%
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500"
                        title="Eliminar"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
