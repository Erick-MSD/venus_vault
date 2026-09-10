import React, { useState, useEffect } from 'react';
import {
  Card,
  StoreProduct,
  PortfolioItem,
  CartItem,
  ActiveTab,
  Currency,
  ThemeMode,
} from './types';
import {
  INITIAL_CARDS,
  INITIAL_STORE_PRODUCTS,
  INITIAL_USER_PORTFOLIO,
} from './data/cards';
import { Navbar } from './components/Navbar';
import { LandingView } from './components/LandingView';
import { MarketView } from './components/MarketView';
import { PortfolioView } from './components/PortfolioView';
import { StoreView } from './components/StoreView';
import { TradeView } from './components/TradeView';
import { QuickAddModal } from './components/QuickAddModal';
import { CardDetailView } from './components/CardDetailView';
import { ProductDetailView } from './components/ProductDetailView';
import { QuickSearchModal } from './components/QuickSearchModal';
import { CartDrawer } from './components/CartDrawer';
import { Footer } from './components/Footer';
import { useLiveExchangeRate } from './hooks/useLiveExchangeRate';
import { motion, AnimatePresence } from 'motion/react';
import { Check, X } from 'lucide-react';

const PORTFOLIO_STORAGE_KEY = 'venus_vault_user_portfolio_v1';
const CART_STORAGE_KEY = 'venus_vault_cart_v1';
const THEME_STORAGE_KEY = 'venus_vault_theme_mode';
const CURRENCY_STORAGE_KEY = 'venus_vault_currency';

export default function App() {
  // Theme state: dark default ("oscuros y morados"), with clean white/light toggle
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    return saved === 'light' ? 'light' : 'dark';
  });

  // Currency: USD default or MXN
  const [currency, setCurrency] = useState<Currency>(() => {
    const saved = localStorage.getItem(CURRENCY_STORAGE_KEY);
    return saved === 'MXN' ? 'MXN' : 'USD';
  });

  // Live Exchange Rate API
  const { exchangeData, refreshRate } = useLiveExchangeRate();

  // Active View Tab
  const [activeTab, setActiveTab] = useState<ActiveTab>('landing');

  // Cards and Store Products
  const [cards] = useState<Card[]>(INITIAL_CARDS);
  const [storeProducts] = useState<StoreProduct[]>(INITIAL_STORE_PRODUCTS);

  // User Portfolio state (persisted locally)
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(() => {
    try {
      const saved = localStorage.getItem(PORTFOLIO_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    // Initialize with rich sample collection for user
    return INITIAL_USER_PORTFOLIO.map((item, idx) => {
      const card = INITIAL_CARDS.find((c) => c.id === item.cardId) || INITIAL_CARDS[0];
      return {
        id: `port-${idx + 1}`,
        cardId: card.id,
        card,
        quantity: item.quantity,
        condition: item.condition,
        purchasePriceUsd: item.purchasePriceUsd,
        purchaseDate: item.purchaseDate,
        isForTrade: item.isForTrade,
        notes: item.notes,
        isGraded: item.isGraded,
        gradeCompany: item.gradeCompany,
        gradeScore: item.gradeScore,
      };
    });
  });

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  });

  // Modal and full-page detail states
  const [selectedCardForDetail, setSelectedCardForDetail] = useState<Card | null>(null);
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<StoreProduct | null>(null);
  const [cardForQuickAdd, setCardForQuickAdd] = useState<Card | null>(null);
  const [isQuickSearchOpen, setIsQuickSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Toast notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Persist portfolio
  useEffect(() => {
    try {
      localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(portfolio));
    } catch (err) {
      console.error('Error saving portfolio:', err);
    }
  }, [portfolio]);

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (err) {
      console.error('Error saving cart:', err);
    }
  }, [cartItems]);

  // Persist theme and sync HTML class for robust Tailwind dark mode
  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [theme]);

  // Persist currency
  useEffect(() => {
    localStorage.setItem(CURRENCY_STORAGE_KEY, currency);
  }, [currency]);

  // Main navigation tab changer that resets any open card or product detail view
  const handleTabChange = (newTab: ActiveTab) => {
    setSelectedCardForDetail(null);
    setSelectedProductForDetail(null);
    setActiveTab(newTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Global keyboard shortcut: Ctrl+K or Cmd+K opens quick search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsQuickSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Portfolio handlers
  const handleAddToPortfolio = (newItem: Omit<PortfolioItem, 'id'>) => {
    const itemWithId: PortfolioItem = {
      ...newItem,
      id: `port-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };

    setPortfolio((prev) => [itemWithId, ...prev]);
    showToast(`Agregado al portafolio: ${newItem.quantity}x ${newItem.card.name} (${newItem.condition})`);
  };

  const handleUpdatePortfolioQuantity = (id: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemovePortfolioItem(id);
      return;
    }
    setPortfolio((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemovePortfolioItem = (id: string) => {
    setPortfolio((prev) => prev.filter((item) => item.id !== id));
    showToast('Carta eliminada del portafolio');
  };

  const handleTogglePortfolioTrade = (id: string) => {
    setPortfolio((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isForTrade: !item.isForTrade } : item))
    );
  };

  // Cart handlers
  const handleAddToCart = (product: StoreProduct, quantity: number = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`Añadido al carrito: ${product.title}`);
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveCartItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Calculate total portfolio value
  const portfolioTotalUsd = portfolio.reduce(
    (acc, item) => acc + item.card.priceUsd * item.quantity,
    0
  );

  const isDark = theme === 'dark';

  return (
    <div
      className={`min-h-screen font-['Gilroy',sans-serif] transition-colors duration-200 selection:bg-indigo-600 selection:text-white ${
        isDark ? 'dark bg-[#0b0f19] text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Toast Notification without emojis */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl border shadow-xl flex items-center gap-3 text-xs font-bold ${
              isDark
                ? 'bg-slate-900/95 text-white border-slate-700 shadow-slate-950/50'
                : 'bg-white/95 text-slate-900 border-slate-200 shadow-slate-300/60'
            }`}
          >
            <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
              <Check size={12} strokeWidth={3} />
            </div>
            <span>{toastMessage}</span>
            <button
              onClick={() => setToastMessage(null)}
              className="text-slate-400 hover:text-slate-200 ml-2"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Navigation Bar */}
      <Navbar
        activeTab={
          selectedCardForDetail
            ? 'market'
            : selectedProductForDetail
            ? 'store'
            : activeTab
        }
        setActiveTab={handleTabChange}
        currency={currency}
        setCurrency={setCurrency}
        theme={theme}
        setTheme={setTheme}
        cartItems={cartItems}
        setIsCartOpen={setIsCartOpen}
        portfolioTotalUsd={portfolioTotalUsd}
        onOpenQuickSearch={() => setIsQuickSearchOpen(true)}
        exchangeRate={exchangeData.rate}
      />

      {/* Main Content with smooth transition between views */}
      <main className="min-h-[calc(100vh-250px)]">
        <AnimatePresence mode="wait">
          {selectedCardForDetail ? (
            <motion.div
              key={`card-detail-${selectedCardForDetail.id}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <CardDetailView
                card={selectedCardForDetail}
                onBack={() => setSelectedCardForDetail(null)}
                onQuickAdd={(c) => setCardForQuickAdd(c)}
                onAddToCart={(c) => {
                  const matchedProd = storeProducts.find((p) => p.title.includes(c.name));
                  if (matchedProd) {
                    handleAddToCart(matchedProd);
                  } else {
                    handleAddToCart({
                      id: `single-${c.id}`,
                      game: c.game,
                      title: `${c.name} (${c.set} #${c.cardNumber})`,
                      priceUsd: c.priceUsd,
                      image: c.image,
                      category: 'singles',
                      stock: 1,
                      description: `Single original certificado Near Mint (NM). Verificado y empaquetado con sleeve protector y toploader rígido.`,
                      specs: [c.rarity, `N° ${c.cardNumber}`, 'Protección Toploader'],
                      badge: 'EXCLUSIVO',
                    });
                  }
                  setIsCartOpen(true);
                }}
                onAddToTrade={() => {
                  setSelectedCardForDetail(null);
                  setActiveTab('trade');
                }}
                currency={currency}
                theme={theme}
                exchangeRate={exchangeData.rate}
              />
            </motion.div>
          ) : selectedProductForDetail ? (
            <motion.div
              key={`product-detail-${selectedProductForDetail.id}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <ProductDetailView
                product={selectedProductForDetail}
                onBack={() => setSelectedProductForDetail(null)}
                onAddToCart={(prod, qty) => {
                  handleAddToCart(prod, qty);
                  setIsCartOpen(true);
                }}
                currency={currency}
                theme={theme}
                exchangeRate={exchangeData.rate}
              />
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              {activeTab === 'landing' && (
                <LandingView
                  cards={cards}
                  storeProducts={storeProducts}
                  setActiveTab={handleTabChange}
                  onSelectCard={(c) => setSelectedCardForDetail(c)}
                  onQuickAdd={(c) => setCardForQuickAdd(c)}
                  onAddToCart={(p) => handleAddToCart(p)}
                  onSelectProduct={(p) => setSelectedProductForDetail(p)}
                  currency={currency}
                  theme={theme}
                />
              )}

              {activeTab === 'market' && (
                <MarketView
                  cards={cards}
                  onSelectCard={(c) => setSelectedCardForDetail(c)}
                  onQuickAdd={(c) => setCardForQuickAdd(c)}
                  currency={currency}
                  setCurrency={setCurrency}
                  theme={theme}
                  exchangeRate={exchangeData.rate}
                  exchangeData={exchangeData}
                  onRefreshRate={refreshRate}
                />
              )}

              {activeTab === 'portfolio' && (
                <PortfolioView
                  portfolio={portfolio}
                  onUpdateQuantity={handleUpdatePortfolioQuantity}
                  onRemoveItem={handleRemovePortfolioItem}
                  onToggleTrade={handleTogglePortfolioTrade}
                  onOpenQuickSearch={() => setIsQuickSearchOpen(true)}
                  currency={currency}
                  theme={theme}
                  exchangeRate={exchangeData.rate}
                />
              )}

              {activeTab === 'store' && (
                <StoreView
                  products={storeProducts}
                  onAddToCart={handleAddToCart}
                  onSelectProduct={(p) => setSelectedProductForDetail(p)}
                  currency={currency}
                  theme={theme}
                  exchangeRate={exchangeData.rate}
                />
              )}

              {activeTab === 'trade' && (
                <TradeView
                  portfolio={portfolio}
                  allCards={cards}
                  currency={currency}
                  theme={theme}
                  exchangeRate={exchangeData.rate}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer theme={theme} setActiveTab={handleTabChange} />

      {/* Modals */}
      {/* 1. Intuitive Quick Add Modal */}
      <QuickAddModal
        card={cardForQuickAdd}
        isOpen={!!cardForQuickAdd}
        onClose={() => setCardForQuickAdd(null)}
        onAddToPortfolio={handleAddToPortfolio}
        currency={currency}
        theme={theme}
        exchangeRate={exchangeData.rate}
      />

      {/* 2. Global Quick Search (Ctrl+K) */}
      <QuickSearchModal
        isOpen={isQuickSearchOpen}
        onClose={() => setIsQuickSearchOpen(false)}
        cards={cards}
        onSelectCard={(c) => {
          setSelectedProductForDetail(null);
          setSelectedCardForDetail(c);
        }}
        onQuickAdd={(c) => setCardForQuickAdd(c)}
        currency={currency}
        theme={theme}
        exchangeRate={exchangeData.rate}
      />

      {/* 3. Cart Drawer with Online Checkout */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        currency={currency}
        theme={theme}
      />
    </div>
  );
}
