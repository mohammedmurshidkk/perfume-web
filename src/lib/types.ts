export const CATEGORIES = ["Oud", "Floral", "Amber", "Woody", "Fresh"] as const;
export type Category = (typeof CATEGORIES)[number];

export const GENDERS = ["Unisex", "Women", "Men"] as const;
export type Gender = (typeof GENDERS)[number];

export const BOTTLES = ["classic", "round", "tall", "facet"] as const;
export type BottleShape = (typeof BOTTLES)[number];

export type Notes = { top: string[]; heart: string[]; base: string[] };

export type Product = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: Category;
  gender: Gender;
  price: number;
  offerPrice: number | null;
  sizeMl: number;
  stock: number;
  bestSeller: boolean;
  active: boolean;
  notes: Notes;
  features: string[];
  images: string[];
  color: string;
  bottle: BottleShape;
  longevity: number; // 1-5
  sillage: number; // 1-5
  createdAt: string;
};

export type Testimonial = {
  id: string;
  name: string;
  location: string;
  quote: string;
  rating: number;
  product: string;
};

export type Settings = {
  whatsapp: string; // international format, digits only, e.g. 919876543210
  currencySymbol: string;
  currencyCode: string;
  email: string;
  phone: string;
  address: string;
  instagram: string;
  announcement: string;
};

export type DB = {
  products: Product[];
  testimonials: Testimonial[];
  settings: Settings;
};
