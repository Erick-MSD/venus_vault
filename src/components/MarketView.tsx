import React, { useState, useMemo } from 'react';
import { Card, GameType, Currency, ThemeMode, CardRarity } from '../types';
import { formatPrice, formatChange } from '../utils/currency';
import { calculateAdjustedPrice } from '../services/currencyService';
import {
  Search,
  SlidersHorizontal,
  TrendingUp,
  TrendingDown,
  Plus,
  ArrowUpDown,
  Check,
  RefreshCw,
  LayoutGrid,
  List,
  X,
} from 'lucide-react';

interface MarketViewProps {
  cards: Card[];
  onSelectCard: (card: Card) => void;
  onQuickAdd: (card: Card) => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  theme: ThemeMode;
  exchangeRate: number;
  exchangeData?: {
    rate: number;
    lastUpdated: string;
    source: string;
    isLive: boolean;
    isLoading: boolean;
  };
  onRefreshRate?: () => void;
}

export const MarketView: React.FC<MarketViewProps> = ({
  cards,
  onSelectCard,
  onQuickAdd,
  currency,
  setCurrency,
  theme,
  exchangeRate,
  exchangeData,
  onRefreshRate,
}) => {
  const isDark = theme === 'dark';

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState<GameType>('all');
  const [selectedRarity, setSelectedRarity] = useState<string>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<'all' | 'EN' | 'ES' | 'JP'>('all');
  const [selectedCondition, setSelectedCondition] = useState<string>('NM');
  const [selectedSet, setSelectedSet] = useState<string>('all');
  const [sortBy, setSortBy] = useState<
    'price_desc' | 'price_asc' | 'change24_desc' | 'change7_desc' | 'name_asc' | 'year_desc'
  >('price_desc');

  // View mode
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [addedCardId, setAddedCardId] = useState<string | null>(null);

  // Available Sets for current game filter
  const availableSets = useMemo(() => {
    const sets = new Set<string>();
    cards.forEach((c) => {
      if (selectedGame === 'all' || c.game === selectedGame) {
        sets.add(c.set);
      }
    });
    return Array.from(sets);
  }, [cards, selectedGame]);

  // Available Rarities
  const availableRarities = useMemo(() => {
    const r = new Set<string>();
    cards.forEach((c) => r.add(c.rarity));
    return Array.from(r);
  }, [cards]);

  // Filtered & Sorted Cards
  const filteredCards = useMemo(() => {
    return cards
      .filter((card) => {
        if (selectedGame !== 'all' && card.game !== selectedGame) return false;
        if (selectedRarity !== 'all' && card.rarity !== selectedRarity) return false;
        if (selectedLanguage !== 'all' && card.language !== selectedLanguage) return false;
        if (selectedSet !== 'all' && card.set !== selectedSet) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = card.name.toLowerCase().includes(q);
          const matchSet = card.set.toLowerCase().includes(q);
          const matchNumber = card.cardNumber.toLowerCase().includes(q);
          const matchRarity = card.rarity.toLowerCase().includes(q);
          if (!matchName && !matchSet && !matchNumber && !matchRarity) return false;
        }
        return true;
      })
      .sort((a, b) => {
        const priceA = calculateAdjustedPrice(a.priceUsd, selectedCondition);
        const priceB = calculateAdjustedPrice(b.priceUsd, selectedCondition);

        if (sortBy === 'price_desc') return priceB - priceA;
        if (sortBy === 'price_asc') return priceA - priceB;
        if (sortBy === 'change24_desc') return b.change24h - a.change24h;
        if (sortBy === 'change7_desc') return b.change7d - a.change7d;
        if (sortBy === 'name_asc') return a.name.localeCompare(b.name);
        if (sortBy === 'year_desc') return (b.releaseYear || 0) - (a.releaseYear || 0);
        return 0;
      });
  }, [cards, selectedGame, selectedRarity, selectedLanguage, selectedSet, searchQuery, sortBy, selectedCondition]);

  const handleInstantQuickAdd = (e: React.MouseEvent, card: Card) => {
    e.stopPropagation();
    onQuickAdd(card);
    setAddedCardId(card.id);
    setTimeout(() => setAddedCardId(null), 1400);
  };

  const hasActiveFilters =
    selectedGame !== 'all' ||
    selectedRarity !== 'all' ||
    selectedLanguage !== 'all' ||
    selectedCondition !== 'NM' ||
    selectedSet !== 'all' ||
    searchQuery.trim() !== '';

  const clearAllFilters = () => {
    setSelectedGame('all');
    setSelectedRarity('all');
    setSelectedLanguage('all');
    setSelectedCondition('NM');
    setSelectedSet('all');
    setSearchQuery('');
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-5 pb-20">
      {/* Top Bar: Title & Live Exchange Rate Indicator (Collectr Clean Style) */}
      <div className="pt-2 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Catálogo de Cartas TCG
            </h1>
            <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              {filteredCards.length}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Precios referenciales de mercado con cotización en tiempo real.
          </p>
        </div>

        {/* Currency Pill & Rate */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="font-bold text-slate-900 dark:text-white">
              1 USD = ${exchangeRate.toFixed(2)} MXN
            </span>
            {onRefreshRate && (
              <button
                onClick={onRefreshRate}
                disabled={exchangeData?.isLoading}
                className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
                title="Actualizar tipo de cambio"
              >
                <RefreshCw size={12} className={exchangeData?.isLoading ? 'animate-spin' : ''} />
              </button>
            )}
          </div>

          {/* Currency Toggle */}
          <div className="flex items-center p-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827]">
            {(['USD', 'MXN', 'DUAL'] as const).map((curr) => (
              <button
                key={curr}
                onClick={() => setCurrency(curr)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                  currency === curr
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {curr === 'DUAL' ? 'Dual' : curr}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TCG Quick Category Pills (Collectr Style) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {(
          [
            { id: 'all', label: 'Todos' },
            { id: 'pokemon', label: 'Pokémon' },
            { id: 'onepiece', label: 'One Piece' },
            { id: 'yugioh', label: 'Yu-Gi-Oh!' },
            { id: 'magic', label: 'Magic: The Gathering' },
          ] as { id: GameType; label: string }[]
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setSelectedGame(tab.id);
              setSelectedSet('all');
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border whitespace-nowrap ${
              selectedGame === tab.id
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white dark:bg-[#111827] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search & Filters Controls Bar */}
      <div className="p-3.5 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] space-y-3 shadow-xs">
        {/* Row 1: Search & Sort & View toggle */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por carta, número o expansión (ej. Charizard, Luffy, 199/165)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-white outline-none focus:border-indigo-500 transition-colors placeholder-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0b0f19] text-slate-800 dark:text-slate-200 outline-none cursor-pointer"
            >
              <option value="price_desc">Mayor Precio ($)</option>
              <option value="price_asc">Menor Precio ($)</option>
              <option value="change24_desc">Mayor Subida 24h (%)</option>
              <option value="change7_desc">Mayor Subida 7d (%)</option>
              <option value="name_asc">Nombre (A-Z)</option>
              <option value="year_desc">Más Recientes</option>
            </select>

            <div className="flex items-center p-0.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0b0f19]">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Vista Cuadrícula"
              >
                <LayoutGrid size={15} />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'table' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Vista Tabla"
              >
                <List size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Specific Dropdown Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          {/* Rareza */}
          <div>
            <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Rareza</label>
            <select
              value={selectedRarity}
              onChange={(e) => setSelectedRarity(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0b0f19] text-slate-800 dark:text-slate-200 outline-none cursor-pointer truncate"
            >
              <option value="all">Todas las Rarezas</option>
              {availableRarities.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Idioma */}
          <div>
            <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Idioma</label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value as any)}
              className="w-full px-2.5 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0b0f19] text-slate-800 dark:text-slate-200 outline-none cursor-pointer"
            >
              <option value="all">Todos los Idiomas</option>
              <option value="EN">Inglés (EN)</option>
              <option value="ES">Español (ES)</option>
              <option value="JP">Japonés (JP)</option>
            </select>
          </div>

          {/* Condición */}
          <div>
            <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Condición</label>
            <select
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0b0f19] text-slate-800 dark:text-slate-200 outline-none cursor-pointer"
            >
              <option value="NM">Near Mint (NM)</option>
              <option value="LP">Lightly Played (LP)</option>
              <option value="MP">Moderately Played (MP)</option>
              <option value="HP">Heavily Played (HP)</option>
              <option value="PSA 10">PSA 10 Gem Mint</option>
              <option value="PSA 9">PSA 9 Mint</option>
              <option value="BGS 9.5">BGS 9.5 Gem Mint</option>
            </select>
          </div>

          {/* Expansión */}
          <div>
            <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Expansión</label>
            <select
              value={selectedSet}
              onChange={(e) => setSelectedSet(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0b0f19] text-slate-800 dark:text-slate-200 outline-none cursor-pointer truncate"
            >
              <option value="all">Todas las Expansiones</option>
              {availableSets.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="flex items-center gap-1.5 flex-wrap pt-1 text-xs">
            <span className="text-[11px] text-slate-500">Filtros:</span>
            {selectedGame !== 'all' && (
              <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] flex items-center gap-1">
                TCG: {selectedGame}
                <button onClick={() => setSelectedGame('all')}>
                  <X size={10} />
                </button>
              </span>
            )}
            {selectedLanguage !== 'all' && (
              <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] flex items-center gap-1">
                Idioma: {selectedLanguage}
                <button onClick={() => setSelectedLanguage('all')}>
                  <X size={10} />
                </button>
              </span>
            )}
            {selectedCondition !== 'NM' && (
              <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] flex items-center gap-1">
                {selectedCondition}
                <button onClick={() => setSelectedCondition('NM')}>
                  <X size={10} />
                </button>
              </span>
            )}
            <button
              onClick={clearAllFilters}
              className="text-[11px] font-bold text-rose-500 hover:underline ml-auto"
            >
              Limpiar
            </button>
          </div>
        )}
      </div>

      {/* Main Cards Content (Collectr Grid) */}
      {filteredCards.length === 0 ? (
        <div className="py-20 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] text-center space-y-3">
          <Search size={28} className="mx-auto text-slate-400" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            No se encontraron cartas con esos filtros
          </h3>
          <button
            onClick={clearAllFilters}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500"
          >
            Restablecer Filtros
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* Collectr Grid: 2 cols on mobile, 3 sm, 4 md, 5 lg, 6 xl */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {filteredCards.map((card) => {
            const adjustedPriceUsd = calculateAdjustedPrice(card.priceUsd, selectedCondition);
            const price = formatPrice(adjustedPriceUsd, currency, true, exchangeRate);
            const change = formatChange(card.change24h);
            const isJustAdded = addedCardId === card.id;

            return (
              <div
                key={card.id}
                onClick={() => onSelectCard(card)}
                className="group relative rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500/80 bg-white dark:bg-[#111827] p-2.5 sm:p-3 flex flex-col justify-between cursor-pointer transition-all hover:shadow-sm"
              >
                <div>
                  {/* Top badges: Language & TCG code */}
                  <div className="flex items-center justify-between text-[10px] mb-1.5">
                    <span className="font-bold text-slate-500 uppercase">
                      {card.game === 'pokemon' ? 'PKMN' : card.game === 'onepiece' ? 'OP' : card.game} • {card.language}
                    </span>
                    <span
                      className={`font-extrabold px-1.5 py-0.5 rounded flex items-center gap-0.5 text-[10px] ${
                        change.isPositive
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                          : 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {change.isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                      <span>{change.text}</span>
                    </span>
                  </div>

                  {/* Artwork */}
                  <div className="relative aspect-[3/4] flex items-center justify-center py-1">
                    <img
                      src={card.image}
                      alt={card.name}
                      referrerPolicy="no-referrer"
                      className="max-h-48 w-auto object-contain rounded drop-shadow-sm group-hover:scale-102 transition-transform duration-200"
                    />
                  </div>

                  {/* Meta: Name, Set, Number */}
                  <div className="mt-2 space-y-0.5">
                    <div className="text-[10px] text-slate-400 truncate">
                      {card.set} • {card.cardNumber}
                    </div>
                    <h3
                      className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors"
                      title={card.name}
                    >
                      {card.name}
                    </h3>
                    <div className="text-[10px] text-slate-500 truncate">
                      {card.rarity}
                    </div>
                  </div>
                </div>

                {/* Bottom: Price & Quick Add Button */}
                <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-1">
                  <div className="min-w-0">
                    <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white block truncate">
                      {price.primary}
                    </span>
                    {price.secondary && (
                      <span className="text-[9px] text-slate-400 block truncate">
                        {price.secondary}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={(e) => handleInstantQuickAdd(e, card)}
                    className={`p-1.5 rounded-lg font-bold transition-colors shrink-0 ${
                      isJustAdded
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white'
                    }`}
                    title="Añadir a mi portafolio"
                  >
                    {isJustAdded ? <Check size={13} /> : <Plus size={13} />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Collectr Table View */
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] overflow-x-auto shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0e131f] text-[10px] font-bold uppercase text-slate-500">
              <tr>
                <th className="p-3">Carta</th>
                <th className="p-3">TCG & Expansión</th>
                <th className="p-3">Rareza</th>
                <th className="p-3">Idioma</th>
                <th className="p-3">Precio Mercado</th>
                <th className="p-3">24h</th>
                <th className="p-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredCards.map((card) => {
                const adjustedPriceUsd = calculateAdjustedPrice(card.priceUsd, selectedCondition);
                const price = formatPrice(adjustedPriceUsd, currency, true, exchangeRate);
                const change = formatChange(card.change24h);
                const isJustAdded = addedCardId === card.id;

                return (
                  <tr
                    key={card.id}
                    onClick={() => onSelectCard(card)}
                    className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="p-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={card.image}
                          alt={card.name}
                          referrerPolicy="no-referrer"
                          className="w-8 h-11 object-contain rounded bg-black/5"
                        />
                        <div>
                          <span className="font-bold block text-slate-900 dark:text-white">
                            {card.name}
                          </span>
                          <span className="text-[10px] text-slate-400">{card.cardNumber}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="font-semibold block text-slate-800 dark:text-slate-200">
                        {card.game === 'pokemon' ? 'Pokémon' : card.game === 'onepiece' ? 'One Piece' : card.game}
                      </span>
                      <span className="text-[10px] text-slate-400">{card.set}</span>
                    </td>
                    <td className="p-3">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {card.rarity}
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-slate-700 dark:text-slate-300">
                      {card.language}
                    </td>
                    <td className="p-3">
                      <span className="font-black text-slate-900 dark:text-white block">
                        {price.primary}
                      </span>
                      {price.secondary && (
                        <span className="text-[10px] text-slate-400 block">{price.secondary}</span>
                      )}
                    </td>
                    <td className="p-3">
                      <span
                        className={`font-bold flex items-center gap-0.5 ${
                          change.isPositive
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-rose-600 dark:text-rose-400'
                        }`}
                      >
                        {change.isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        <span>{change.text}</span>
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={(e) => handleInstantQuickAdd(e, card)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                          isJustAdded
                            ? 'bg-emerald-600 text-white'
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                        }`}
                      >
                        {isJustAdded ? 'Agregado' : '+ Portafolio'}
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
