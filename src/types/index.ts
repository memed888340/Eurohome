export interface Subcategory {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  subcategories: Subcategory[];
}

export interface City {
  id: string;
  name: string;
}

export interface Ad {
  id: string;
  title: string;
  price: number;
  currency: 'AZN' | 'USD';
  city: string;
  categoryId: string;
  subcategoryId: string;
  image: string;
  isFeatured?: boolean;
  isUrgent?: boolean;
  createdAt: string;
  seller: {
    name: string;
    phone: string;
    isPro?: boolean;
  };
  description: string;
  views: number;
}
