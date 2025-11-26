export interface ProductColor {
  name: string;
  hex: string;
  image: string;
}

export interface ProductSpecification {
  name: string;
  value: string;
}

export interface Product {
  id?: string;
  _id?: string;
  name: string;
  category: string;
  description: string;
  price: number;
  discountType?: 'percentage' | 'fixed';
  discountValue?: number;
  stock: number;
  imageUrls: string[];
  colors: ProductColor[];
  sizes: string[];
  specifications?: ProductSpecification[];
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Category {
  id?: string;
  _id?: string;
  name: string;
  description?: string;
  imageUrl?: string;
  href?: string;
  isActive: boolean;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  size?: string;
  color?: string;
  colorHex?: string;
  appliedDiscountType?: 'percentage' | 'fixed';
  appliedDiscountValue?: number;
  cartKey: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
}

export interface Order {
  id?: string;
  _id?: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod?: string;
  shippingAddress?: {
    fullName: string;
    phone: string;
    streetAddress: string;
    city: string;
    postalCode: string;
  };
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface User {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  role: 'user' | 'admin';
  avatar?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Address {
  id?: string;
  _id?: string;
  userId: string;
  fullName: string;
  phone: string;
  streetAddress: string;
  city: string;
  postalCode: string;
  isDefault: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface HeroSlide {
  id?: string;
  _id?: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  buttonText?: string;
  buttonLink?: string;
  isActive: boolean;
  displayOrder: number;
}

export interface FeaturedBanner {
  id?: string;
  _id?: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  buttonText?: string;
  buttonLink?: string;
  isActive: boolean;
}

export interface Coupon {
  id?: string;
  _id?: string;
  code: string;
  description?: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchaseAmount?: number;
  maxUsageCount?: number;
  usageCount: number;
  expiryDate?: Date;
  isActive: boolean;
}
