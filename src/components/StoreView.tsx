import React, { useState, useMemo } from 'react';
import { StoreProduct, GameType, Currency, ThemeMode } from '../types';
import { formatPrice } from '../utils/currency';
import {
  ShoppingBag,
  Check,
  ShieldCheck,
  Truck,
  Search,
  Tag,
} from 'lucide-react';

interface StoreViewProps {
  products: StoreProduct[];
  onAddToCart: (product: StoreProduct) => void;
  onSelectProduct?: (product: StoreProduct) => void;
  currency: Currency;
  theme: ThemeMode;
  exchangeRate?: number;
}

export const StoreView: React.FC<StoreViewProps> = ({
  products,
  onAddToCart,
  onSelectProduct,
  currency,
  theme,
  exchangeRate = 18.65,
}) => {
  const isDark = theme === 'dark';
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedGame, setSelectedGame] = useState<GameType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'Todos los Productos' },
    { id: 'etb', label: 'ETBs (Cajas Elite)' },
    { id: 'booster_box', label: 'Booster Boxes' },
    { id: 'singles', label: 'Singles Certificados' },
    { id: 'accessories', label: 'Accesorios & Micas' },
  ];

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
      if (selectedGame !== 'all' && p.game !== selectedGame) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = p.title.toLowerCase().includes(q);
        const matchDesc = p.description.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc) return false;
      }
      return true;
    });
  }, [products, selectedCategory, selectedGame, searchQuery]);

  const handleAdd = (product: StoreProduct) => {
    onAddToCart(product);
    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-6 pb-20">
      {/* Clean Store Header (Collectr Style) */}
      <div
        className={`p-6 sm:p-8 rounded-3xl border ${
          isDark
            ? 'bg-[#111827] border-slate-800'
            : 'bg-white border-slate-200 shadow-xs'
        }`}
      >
        <div className="max-w-2xl space-y-2.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <Tag size={13} />
            <span>Tienda Oficial Venus Vault México</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Productos Sellados & Singles con Compra en Línea
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Catálogo con inventario disponible para entrega y envío nacional asegurado por DHL o Estafeta. Todas las compras se procesan 100% en línea de manera segura.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck size={16} />
              <span>Garantía de Originalidad & Sin Pesar</span>
            </div>
            <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
              <Truck size={16} />
              <span>Envíos Nacionales con Protección Antigolpes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors border ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 border-indigo-600 text-white'
                  : isDark
                  ? 'bg-[#111827] border-slate-800 text-slate-300 hover:border-slate-700'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedGame}
            onChange={(e) => setSelectedGame(e.target.value as any)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border outline-none cursor-pointer ${
              isDark
                ? 'bg-[#111827] border-slate-800 text-slate-200'
                : 'bg-white border-slate-200 text-slate-800'
            }`}
          >
            <option value="all">Todos los Juegos</option>
            <option value="pokemon">Pokémon TCG</option>
            <option value="onepiece">One Piece TCG</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-20 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] text-center space-y-2">
          <Search size={24} className="mx-auto text-slate-400" />
          <p className="text-xs text-slate-500">No hay productos en esta categoría por el momento.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {filteredProducts.map((prod) => {
            const price = formatPrice(prod.priceUsd, currency, false, exchangeRate);
            const origPrice = prod.originalPriceUsd
              ? formatPrice(prod.originalPriceUsd, currency, false, exchangeRate)
              : null;
            const isJustAdded = addedProductId === prod.id;

            return (
              <div
                key={prod.id}
                className={`p-4 sm:p-5 rounded-2xl border flex flex-col justify-between transition-all group ${
                  isDark
                    ? 'bg-[#111827] border-slate-800 hover:border-slate-700 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
              >
                <div
                  onClick={() => onSelectProduct && onSelectProduct(prod)}
                  className="cursor-pointer"
                  title="Ver detalle del producto"
                >
                  {/* Badge & Stock */}
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                        prod.badge === 'OFERTA'
                          ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                          : prod.badge === 'PREVENTA'
                          ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                          : 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400'
                      }`}
                    >
                      {prod.badge || 'EN STOCK'}
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                      {prod.stock} disponibles
                    </span>
                  </div>

                  {/* Product Image */}
                  <div className="aspect-square flex items-center justify-center p-3 bg-slate-50 dark:bg-[#0b0f19] rounded-xl mb-3">
                    <img
                      src={prod.image}
                      alt={prod.title}
                      referrerPolicy="no-referrer"
                      className="max-h-40 w-auto object-contain drop-shadow-sm group-hover:scale-103 transition-transform duration-200"
                    />
                  </div>

                  <h3 className="text-xs sm:text-sm font-bold line-clamp-2 text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {prod.title}
                  </h3>
                  <p className="text-xs mt-1 line-clamp-2 text-slate-500">
                    {prod.description}
                  </p>
                </div>

                {/* Price and Add Button */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white truncate">
                        {price.primary}
                      </span>
                      {origPrice && (
                        <span className="text-xs line-through text-slate-400">
                          {origPrice.primary}
                        </span>
                      )}
                    </div>
                    {price.secondary && (
                      <span className="text-[10px] text-slate-400 block truncate">
                        {price.secondary}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleAdd(prod)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                      isJustAdded
                        ? 'bg-emerald-600 text-white'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs active:scale-98'
                    }`}
                  >
                    {isJustAdded ? (
                      <>
                        <Check size={14} className="stroke-[3]" />
                        <span>Agregado</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={14} />
                        <span>Comprar</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
