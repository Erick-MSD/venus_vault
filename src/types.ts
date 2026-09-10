export type GameType = 'all' | 'pokemon' | 'onepiece' | 'yugioh' | 'magic';

export type CardRarity = 
  | 'Common'
  | 'Uncommon'
  | 'Rare'
  | 'Double Rare'
  | 'Ultra Rare'
  | 'Illustration Rare'
  | 'Special Illustration Rare'
  | 'Secret Rare'
  | 'Hyper Rare'
  | 'Manga Rare'
  | 'Leader Alt Art'
  | 'Super Rare';

export type CardCondition = 'NM' | 'LP' | 'MP' | 'HP' | 'PSA 10' | 'PSA 9' | 'BGS 9.5';

export interface PricePoint {
  date: string;
  usd: number;
}

export interface Card {
  id: string;
  name: string;
  game: 'pokemon' | 'onepiece' | 'yugioh' | 'magic';
  set: string;
  setCode: string;
  cardNumber: string;
  rarity: CardRarity;
  cardType: string;
  image: string;
  priceUsd: number;
  change24h: number; // percentage
  change7d: number;
  marketTrend: 'up' | 'down' | 'stable';
  releaseYear: number;
  language: 'EN' | 'ES' | 'JP';
  priceHistory: PricePoint[];
  inStoreStock?: number;
  storePriceUsd?: number;
  isStoreExclusive?: boolean;
}

export interface StoreProduct {
  id: string;
  title: string;
  game: 'pokemon' | 'onepiece' | 'yugioh' | 'magic';
  category: 'singles' | 'etb' | 'booster_box' | 'sleeved_packs' | 'accessories' | 'promos';
  priceUsd: number;
  originalPriceUsd?: number;
  image: string;
  stock: number;
  badge?: 'OFERTA' | 'DESTACADO' | 'NUEVO' | 'PREVENTA' | 'EXCLUSIVO';
  description: string;
  specs: string[];
}

export interface PortfolioItem {
  id: string;
  cardId: string;
  card: Card;
  quantity: number;
  condition: CardCondition;
  purchasePriceUsd: number;
  purchaseDate: string;
  isForTrade: boolean;
  notes?: string;
  isGraded?: boolean;
  gradeCompany?: 'PSA' | 'BGS' | 'CGC';
  gradeScore?: number;
}

export interface CartItem {
  product: StoreProduct;
  quantity: number;
}

export type ActiveTab = 'landing' | 'store' | 'market' | 'portfolio' | 'trade';

export type Currency = 'USD' | 'MXN' | 'DUAL';

export type ThemeMode = 'dark' | 'light';
