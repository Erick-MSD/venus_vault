import React, { useState } from 'react';
import { CartItem, Currency, ThemeMode } from '../types';
import { formatPrice } from '../utils/currency';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ShieldCheck,
  Check,
  ArrowRight,
  ArrowLeft,
  CreditCard,
  Building2,
  QrCode,
  Truck,
  Receipt,
  Lock,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  currency: Currency;
  theme: ThemeMode;
  exchangeRate?: number;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  currency,
  theme,
  exchangeRate = 18.65,
}) => {
  const isDark = theme === 'dark';
  
  // Checkout flow states: 'cart' -> 'shipping' -> 'payment' -> 'success'
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'shipping' | 'payment' | 'success'>('cart');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState<string>('');

  // Shipping form
  const [shippingData, setShippingData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    neighborhood: '',
    city: '',
    state: 'Ciudad de México',
    postalCode: '',
  });

  // Payment form
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mercadopago' | 'spei' | 'oxxo'>('card');
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
  });

  const totalUsd = cartItems.reduce((acc, item) => acc + item.product.priceUsd * item.quantity, 0);
  const totalFormatted = formatPrice(totalUsd, currency, false, exchangeRate);
  const totalMxn = totalUsd * exchangeRate;

  const handleProcessOrder = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const randomOrder = `VV-${Math.floor(10000 + Math.random() * 90000)}`;
      setOrderId(randomOrder);
      setCheckoutStep('success');
      onClearCart();
    }, 1500);
  };

  const handleClose = () => {
    setCheckoutStep('cart');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 26, stiffness: 220 }}
          className={`w-full max-w-lg h-full flex flex-col justify-between shadow-2xl border-l ${
            isDark
              ? 'bg-[#0f1420] border-slate-800 text-slate-100'
              : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          {/* Header */}
          <div
            className={`px-6 py-4 flex items-center justify-between border-b ${
              isDark ? 'border-slate-800 bg-[#141b2b]' : 'border-slate-200 bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-600/15 text-indigo-500 dark:text-indigo-400">
                <ShoppingBag size={18} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {checkoutStep === 'cart'
                    ? 'Carrito de Compras'
                    : checkoutStep === 'shipping'
                    ? 'Datos de Envío'
                    : checkoutStep === 'payment'
                    ? 'Pago en Línea'
                    : 'Confirmación de Pedido'}
                </h3>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {checkoutStep === 'cart'
                    ? `${cartItems.reduce((acc, item) => acc + item.quantity, 0)} artículos`
                    : 'Venus Vault Checkout Seguro'}
                </span>
              </div>
            </div>

            <button
              onClick={handleClose}
              className={`p-2 rounded-xl transition-colors ${
                isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-200 text-slate-600'
              }`}
            >
              <X size={18} />
            </button>
          </div>

          {/* Body Content by Step */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {/* STEP 1: CART ITEMS */}
            {checkoutStep === 'cart' && (
              <>
                {cartItems.length === 0 ? (
                  <div className="py-24 text-center space-y-3">
                    <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                      <ShoppingBag size={28} />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Tu carrito está vacío</h4>
                    <p className="text-xs max-w-xs mx-auto text-slate-500">
                      Explora singles, ETBs o cajas de sobres en la tienda oficial para comenzar tu pedido en línea.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cartItems.map((item) => {
                      const itemPrice = formatPrice(item.product.priceUsd * item.quantity, currency, false, exchangeRate);

                      return (
                        <div
                          key={item.product.id}
                          className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${
                            isDark ? 'bg-[#151c2c] border-slate-800' : 'bg-slate-50 border-slate-200'
                          }`}
                        >
                          <img
                            src={item.product.image}
                            alt={item.product.title}
                            referrerPolicy="no-referrer"
                            className="w-14 h-16 object-contain rounded bg-black/10 shrink-0"
                          />

                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold line-clamp-2 text-slate-900 dark:text-slate-100">
                              {item.product.title}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">
                                {itemPrice.primary}
                              </span>
                              {itemPrice.secondary && (
                                <span className="text-[10px] text-slate-500">{itemPrice.secondary}</span>
                              )}
                            </div>

                            {/* Stepper */}
                            <div className="flex items-center gap-3 mt-2">
                              <div className="flex items-center border rounded-lg border-slate-300 dark:border-slate-700">
                                <button
                                  onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                                  className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                                >
                                  <Minus size={12} />
                                </button>
                                <span className="px-2 text-xs font-bold">{item.quantity}</span>
                                <button
                                  onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                                  className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                                >
                                  <Plus size={12} />
                                </button>
                              </div>

                              <button
                                onClick={() => onRemoveItem(item.product.id)}
                                className="text-[11px] text-rose-500 hover:underline"
                              >
                                Eliminar
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}

            {/* STEP 2: SHIPPING ADDRESS FORM */}
            {checkoutStep === 'shipping' && (
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                  <Truck size={16} />
                  <span>Envíos asegurados a toda la República Mexicana</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-semibold block mb-1 text-slate-600 dark:text-slate-300">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. Carlos Mendoza"
                      value={shippingData.fullName}
                      onChange={(e) => setShippingData({ ...shippingData, fullName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#151c2c] text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-semibold block mb-1 text-slate-600 dark:text-slate-300">
                        Correo Electrónico *
                      </label>
                      <input
                        type="email"
                        placeholder="tu@correo.com"
                        value={shippingData.email}
                        onChange={(e) => setShippingData({ ...shippingData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#151c2c] text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="font-semibold block mb-1 text-slate-600 dark:text-slate-300">
                        Teléfono Móvil *
                      </label>
                      <input
                        type="tel"
                        placeholder="55 1234 5678"
                        value={shippingData.phone}
                        onChange={(e) => setShippingData({ ...shippingData, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#151c2c] text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold block mb-1 text-slate-600 dark:text-slate-300">
                      Calle y Número *
                    </label>
                    <input
                      type="text"
                      placeholder="Av. Insurgentes Sur 1602, Int 4"
                      value={shippingData.address}
                      onChange={(e) => setShippingData({ ...shippingData, address: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#151c2c] text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-semibold block mb-1 text-slate-600 dark:text-slate-300">
                        Colonia *
                      </label>
                      <input
                        type="text"
                        placeholder="Crédito Constructor"
                        value={shippingData.neighborhood}
                        onChange={(e) => setShippingData({ ...shippingData, neighborhood: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#151c2c] text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="font-semibold block mb-1 text-slate-600 dark:text-slate-300">
                        Código Postal *
                      </label>
                      <input
                        type="text"
                        placeholder="03940"
                        value={shippingData.postalCode}
                        onChange={(e) => setShippingData({ ...shippingData, postalCode: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#151c2c] text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-semibold block mb-1 text-slate-600 dark:text-slate-300">
                        Ciudad / Municipio *
                      </label>
                      <input
                        type="text"
                        placeholder="Benito Juárez"
                        value={shippingData.city}
                        onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#151c2c] text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="font-semibold block mb-1 text-slate-600 dark:text-slate-300">
                        Estado *
                      </label>
                      <select
                        value={shippingData.state}
                        onChange={(e) => setShippingData({ ...shippingData, state: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#151c2c] text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                      >
                        <option value="Ciudad de México">Ciudad de México</option>
                        <option value="Estado de México">Estado de México</option>
                        <option value="Jalisco">Jalisco</option>
                        <option value="Nuevo León">Nuevo León</option>
                        <option value="Puebla">Puebla</option>
                        <option value="Querétaro">Querétaro</option>
                        <option value="Yucatán">Yucatán</option>
                        <option value="Otro Estado">Otro Estado</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: PAYMENT METHOD */}
            {checkoutStep === 'payment' && (
              <div className="space-y-4">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Selecciona método de pago seguro
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between text-xs transition-all ${
                      paymentMethod === 'card'
                        ? 'border-indigo-600 bg-indigo-500/10 ring-1 ring-indigo-500'
                        : isDark
                        ? 'border-slate-800 bg-[#151c2c]'
                        : 'border-slate-200 bg-slate-50'
                    }`}
                  >
                    <CreditCard size={18} className="text-indigo-500 mb-2" />
                    <span className="font-bold">Tarjeta Débito / Crédito</span>
                    <span className="text-[10px] text-slate-500">Visa, Mastercard, AMEX</span>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('mercadopago')}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between text-xs transition-all ${
                      paymentMethod === 'mercadopago'
                        ? 'border-indigo-600 bg-indigo-500/10 ring-1 ring-indigo-500'
                        : isDark
                        ? 'border-slate-800 bg-[#151c2c]'
                        : 'border-slate-200 bg-slate-50'
                    }`}
                  >
                    <Lock size={18} className="text-sky-500 mb-2" />
                    <span className="font-bold">Mercado Pago</span>
                    <span className="text-[10px] text-slate-500">Saldo o mensualidades</span>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('spei')}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between text-xs transition-all ${
                      paymentMethod === 'spei'
                        ? 'border-indigo-600 bg-indigo-500/10 ring-1 ring-indigo-500'
                        : isDark
                        ? 'border-slate-800 bg-[#151c2c]'
                        : 'border-slate-200 bg-slate-50'
                    }`}
                  >
                    <Building2 size={18} className="text-emerald-500 mb-2" />
                    <span className="font-bold">Transferencia SPEI</span>
                    <span className="text-[10px] text-slate-500">Aprobación inmediata</span>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('oxxo')}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between text-xs transition-all ${
                      paymentMethod === 'oxxo'
                        ? 'border-indigo-600 bg-indigo-500/10 ring-1 ring-indigo-500'
                        : isDark
                        ? 'border-slate-800 bg-[#151c2c]'
                        : 'border-slate-200 bg-slate-50'
                    }`}
                  >
                    <QrCode size={18} className="text-amber-500 mb-2" />
                    <span className="font-bold">OXXO Pay</span>
                    <span className="text-[10px] text-slate-500">Código de pago en tienda</span>
                  </button>
                </div>

                {/* Card Fields */}
                {paymentMethod === 'card' && (
                  <div className="space-y-2.5 pt-2 text-xs">
                    <div>
                      <label className="font-semibold block mb-1 text-slate-600 dark:text-slate-300">
                        Número de Tarjeta
                      </label>
                      <input
                        type="text"
                        placeholder="4532 •••• •••• 8921"
                        value={cardData.number}
                        onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#151c2c] text-slate-900 dark:text-white outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="font-semibold block mb-1 text-slate-600 dark:text-slate-300">
                        Titular de la Tarjeta
                      </label>
                      <input
                        type="text"
                        placeholder="Nombre como aparece en la tarjeta"
                        value={cardData.name}
                        onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#151c2c] text-slate-900 dark:text-white outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="font-semibold block mb-1 text-slate-600 dark:text-slate-300">
                          Vencimiento (MM/AA)
                        </label>
                        <input
                          type="text"
                          placeholder="12/28"
                          value={cardData.expiry}
                          onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#151c2c] text-slate-900 dark:text-white outline-none font-mono"
                        />
                      </div>
                      <div>
                        <label className="font-semibold block mb-1 text-slate-600 dark:text-slate-300">
                          CVV / CVC
                        </label>
                        <input
                          type="password"
                          maxLength={4}
                          placeholder="•••"
                          value={cardData.cvv}
                          onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#151c2c] text-slate-900 dark:text-white outline-none font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* SPEI CLABE */}
                {paymentMethod === 'spei' && (
                  <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#151c2c] space-y-2 text-xs">
                    <span className="font-bold block text-slate-900 dark:text-white">Datos de Transferencia SPEI</span>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Banco Receptor:</span>
                      <span className="font-semibold">STP / Venus Vault Pagos</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">CLABE Interbancaria:</span>
                      <span className="font-mono font-bold text-indigo-500">6461 8015 7029 4810 22</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Monto exacto:</span>
                      <span className="font-bold">${totalMxn.toFixed(2)} MXN</span>
                    </div>
                    <p className="text-[10px] text-slate-500 pt-1">
                      Tu pedido se liberará de inmediato tras la confirmación de la transferencia.
                    </p>
                  </div>
                )}

                {/* OXXO PAY */}
                {paymentMethod === 'oxxo' && (
                  <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#151c2c] space-y-2 text-xs text-center">
                    <span className="font-bold block text-slate-900 dark:text-white">Pago en Tiendas OXXO</span>
                    <div className="py-2 font-mono text-base font-black tracking-widest text-indigo-500">
                      9340 1823 4901 8219
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Presenta este número en caja o descarga tu ficha digital de pago.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* STEP 4: ORDER SUCCESS */}
            {checkoutStep === 'success' && (
              <div className="py-10 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center mx-auto">
                  <Check size={32} className="stroke-[3]" />
                </div>
                <div>
                  <h4 className="text-lg font-black text-slate-900 dark:text-white">
                    ¡Compra en Línea Confirmada!
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Número de Orden: <span className="font-mono font-bold text-indigo-500">{orderId}</span>
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#151c2c] text-xs text-left space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Estado del Pago:</span>
                    <span className="font-bold text-emerald-500">Aprobado y Verificado</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Método de Envío:</span>
                    <span className="font-semibold">Estafeta / DHL Express Asegurado</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Fecha Estimada de Entrega:</span>
                    <span className="font-semibold">2 a 4 días hábiles</span>
                  </div>
                </div>

                <button
                  onClick={handleClose}
                  className="w-full py-3 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500"
                >
                  Regresar a la Tienda
                </button>
              </div>
            )}
          </div>

          {/* Footer & Navigation Controls */}
          {cartItems.length > 0 && checkoutStep !== 'success' && (
            <div
              className={`p-6 border-t space-y-3 ${
                isDark ? 'border-slate-800 bg-[#141b2b]' : 'border-slate-200 bg-slate-50'
              }`}
            >
              {/* Order total */}
              <div className="flex items-baseline justify-between text-xs">
                <span className="font-semibold text-slate-500">Total a Pagar:</span>
                <div className="text-right">
                  <span className="text-xl font-black text-indigo-600 dark:text-indigo-400">
                    {totalFormatted.primary}
                  </span>
                  {totalFormatted.secondary && (
                    <span className="text-xs block text-slate-500">{totalFormatted.secondary}</span>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2">
                {checkoutStep !== 'cart' && (
                  <button
                    onClick={() => {
                      if (checkoutStep === 'payment') setCheckoutStep('shipping');
                      else if (checkoutStep === 'shipping') setCheckoutStep('cart');
                    }}
                    className={`p-3 rounded-xl border text-xs font-bold transition-colors ${
                      isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <ArrowLeft size={16} />
                  </button>
                )}

                {checkoutStep === 'cart' && (
                  <button
                    onClick={() => setCheckoutStep('shipping')}
                    className="flex-1 py-3 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 flex items-center justify-center gap-2 shadow-sm"
                  >
                    <span>Proceder al Envío</span>
                    <ArrowRight size={14} />
                  </button>
                )}

                {checkoutStep === 'shipping' && (
                  <button
                    onClick={() => setCheckoutStep('payment')}
                    className="flex-1 py-3 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 flex items-center justify-center gap-2 shadow-sm"
                  >
                    <span>Continuar al Pago</span>
                    <ArrowRight size={14} />
                  </button>
                )}

                {checkoutStep === 'payment' && (
                  <button
                    onClick={handleProcessOrder}
                    disabled={isProcessing}
                    className="flex-1 py-3 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <span>Procesando pago seguro...</span>
                    ) : (
                      <>
                        <Lock size={14} />
                        <span>Pagar en Línea ${totalMxn.toFixed(2)} MXN</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
