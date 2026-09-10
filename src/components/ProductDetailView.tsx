import React, { useState } from 'react';
import { StoreProduct, Currency, ThemeMode } from '../types';
import { formatPrice } from '../utils/currency';
import {
  ArrowLeft,
  ExternalLink,
  ShieldCheck,
  Truck,
  PackageCheck,
  Check,
  ShoppingBag,
  Plus,
  Minus,
  Sparkles,
  Award,
} from 'lucide-react';

interface ProductDetailViewProps {
  product: StoreProduct;
  onBack: () => void;
  onAddToCart: (product: StoreProduct, quantity?: number) => void;
  currency: Currency;
  theme: ThemeMode;
  exchangeRate: number;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  onBack,
  onAddToCart,
  currency,
  theme,
  exchangeRate,
}) => {
  const isDark = theme === 'dark';
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const price = formatPrice(product.priceUsd * quantity, currency, true, exchangeRate);
  const unitPrice = formatPrice(product.priceUsd, currency, false, exchangeRate);
  const origPrice = product.originalPriceUsd
    ? formatPrice(product.originalPriceUsd * quantity, currency, false, exchangeRate)
    : null;

  const handleAdd = () => {
    onAddToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleOpenExternalWindow = () => {
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${product.title} - Venus Vault México</title>
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
            .product-wrapper {
              max-width: 680px;
              width: 100%;
              background: #111827;
              border: 1px solid #1f293d;
              border-radius: 24px;
              padding: 36px;
              box-shadow: 0 20px 40px rgba(0,0,0,0.5);
              text-align: center;
            }
            img {
              max-width: 280px;
              max-height: 280px;
              object-fit: contain;
              margin: 20px auto;
              border-radius: 12px;
            }
            .badge {
              display: inline-block;
              padding: 6px 14px;
              border-radius: 8px;
              font-size: 11px;
              font-weight: 800;
              text-transform: uppercase;
              letter-spacing: 0.05em;
              background: rgba(99, 102, 241, 0.2);
              color: #818cf8;
              margin-bottom: 12px;
            }
            h1 { font-size: 24px; margin: 10px 0; font-weight: 800; }
            .desc { color: #94a3b8; font-size: 14px; line-height: 1.6; margin: 16px 0; text-align: left; }
            .specs { text-align: left; margin: 20px 0; padding: 16px; background: #0b0f19; border-radius: 12px; border: 1px solid #1f293d; }
            .specs h4 { margin: 0 0 10px 0; font-size: 12px; color: #818cf8; text-transform: uppercase; }
            .specs li { font-size: 13px; color: #cbd5e1; margin-bottom: 6px; }
            .price-block { margin: 24px 0 16px 0; }
            .price { font-size: 32px; font-weight: 900; color: #818cf8; }
            .stock { font-size: 13px; color: #10b981; font-weight: 700; margin-top: 4px; }
            button {
              margin-top: 20px;
              padding: 12px 32px;
              background: #6366f1;
              color: white;
              border: none;
              border-radius: 12px;
              font-weight: 700;
              font-size: 14px;
              cursor: pointer;
            }
          </style>
        </head>
        <body>
          <div class="product-wrapper">
            <span class="badge">${product.game === 'pokemon' ? 'Pokémon TCG' : 'One Piece TCG'} • ${product.category.toUpperCase()}</span>
            <h1>${product.title}</h1>
            <img src="${product.image}" alt="${product.title}" />
            <div class="price-block">
              <div class="price">$${product.priceUsd.toFixed(2)} USD</div>
              <div class="stock">Disponible en inventario (${product.stock} piezas)</div>
            </div>
            <div class="desc">${product.description}</div>
            <div class="specs">
              <h4>Especificaciones y Contenido</h4>
              <ul>
                ${product.specs.map((s) => `<li>${s}</li>`).join('')}
              </ul>
            </div>
            <button onclick="window.close()">Cerrar Ventana</button>
          </div>
        </body>
        </html>
      `);
      newWindow.document.close();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-24 animate-fadeIn">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={onBack}
          className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors ${
            isDark
              ? 'bg-slate-800/90 hover:bg-slate-700 text-slate-200'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
          }`}
        >
          <ArrowLeft size={16} />
          <span>Volver a la Tienda</span>
        </button>

        <div className="flex items-center gap-2">
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
        {/* Left Column: Product Image & Trust Badges */}
        <div className="lg:col-span-5 space-y-4">
          <div
            className={`p-8 rounded-3xl border flex items-center justify-center min-h-[380px] transition-all shadow-xs ${
              isDark
                ? 'bg-[#111827] border-slate-800'
                : 'bg-white border-slate-200'
            }`}
          >
            {imgError ? (
              <div className="text-center p-8 space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center">
                  <Award size={32} />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {product.title}
                </h4>
                <p className="text-xs text-slate-500">
                  {product.game === 'pokemon' ? 'Pokémon TCG' : 'One Piece TCG'} • Producto Oficial
                </p>
              </div>
            ) : (
              <img
                src={product.image}
                alt={product.title}
                onError={() => setImgError(true)}
                referrerPolicy="no-referrer"
                className="max-h-72 sm:max-h-80 w-auto object-contain drop-shadow-md hover:scale-103 transition-transform duration-300"
              />
            )}
          </div>

          {/* Guarantees Box */}
          <div
            className={`p-4 rounded-2xl border space-y-3 ${
              isDark
                ? 'bg-[#111827]/60 border-slate-800 text-slate-300'
                : 'bg-white border-slate-200 text-slate-700 shadow-xs'
            }`}
          >
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
              <ShieldCheck size={16} className="text-emerald-500" />
              <span>Garantías Venus Vault México</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-start gap-2">
                <PackageCheck size={14} className="text-indigo-500 shrink-0 mt-0.5" />
                <span><strong>100% Original Sellado de Fábrica:</strong> Garantía de no adulterado ni pesado.</span>
              </li>
              <li className="flex items-start gap-2">
                <Truck size={14} className="text-indigo-500 shrink-0 mt-0.5" />
                <span><strong>Envío Nacional Asegurado:</strong> Despacho por DHL Express o Estafeta con código de rastreo.</span>
              </li>
              <li className="flex items-start gap-2">
                <Award size={14} className="text-indigo-500 shrink-0 mt-0.5" />
                <span><strong>Empaque Reforzado:</strong> Envoltura con burbuja multicapa y caja rígida antigolpes.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: Pricing, Specs & Buy Controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* Header Info */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
                {product.game === 'pokemon' ? 'Pokémon TCG' : 'One Piece TCG'}
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {product.category.replace('_', ' ').toUpperCase()}
              </span>
              {product.badge && (
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase bg-rose-500/15 text-rose-600 dark:text-rose-400">
                  {product.badge}
                </span>
              )}
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 ml-auto">
                {product.stock} unidades en stock
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              {product.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed pt-1">
              {product.description}
            </p>
          </div>

          {/* Pricing Box */}
          <div
            className={`p-5 rounded-2xl border space-y-3 ${
              isDark
                ? 'bg-[#111827] border-slate-800'
                : 'bg-white border-slate-200 shadow-xs'
            }`}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <span className="text-xs font-bold uppercase text-slate-500 block mb-1">
                  Precio Total:
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                    {price.primary}
                  </span>
                  {origPrice && (
                    <span className="text-sm line-through text-slate-400">
                      {origPrice.primary}
                    </span>
                  )}
                </div>
                {price.secondary && (
                  <span className="text-xs text-indigo-600 dark:text-indigo-400 font-bold block mt-0.5">
                    {price.secondary} (Cotización en tiempo real)
                  </span>
                )}
              </div>

              {/* Quantity Picker */}
              <div>
                <label className="text-xs font-bold uppercase text-slate-500 block mb-1.5 text-right">
                  Cantidad:
                </label>
                <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0b0f19] p-1">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white disabled:opacity-30"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="font-bold text-sm px-3 text-slate-900 dark:text-white">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    disabled={quantity >= product.stock}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white disabled:opacity-30"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={handleAdd}
                className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-xs ${
                  isAdded
                    ? 'bg-emerald-600 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white active:scale-98'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check size={18} className="stroke-[3]" />
                    <span>Añadido al Carrito</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={18} />
                    <span>Añadir {quantity} al Carrito</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Specifications List */}
          <div
            className={`p-5 rounded-2xl border space-y-3 ${
              isDark
                ? 'bg-[#111827] border-slate-800'
                : 'bg-white border-slate-200 shadow-xs'
            }`}
          >
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Especificaciones y Contenido del Paquete
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {product.specs.map((spec, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-[#0b0f19] border border-slate-100 dark:border-slate-800/80 text-slate-800 dark:text-slate-200"
                >
                  <Check size={14} className="text-emerald-500 shrink-0" />
                  <span className="font-semibold">{spec}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
