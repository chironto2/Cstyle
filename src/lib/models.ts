import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: 'user' | 'admin';
  avatar?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    phone: { type: String },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    avatar: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Index for faster queries
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });

export const User =
  mongoose.models.User || mongoose.model<IUser>('User', userSchema);

// ==================== PRODUCT ====================

export interface IProductColor {
  name: string;
  hex: string;
  image: string;
}

export interface IProductSpecification {
  name: string;
  value: string;
}

export interface IProduct extends Document {
  name: string;
  category: string;
  description: string;
  price: number;
  discountType?: 'percentage' | 'fixed';
  discountValue?: number;
  stock: number;
  imageUrls: string[];
  colors: IProductColor[];
  sizes: string[];
  specifications?: IProductSpecification[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true, min: 0 },
    discountType: { type: String, enum: ['percentage', 'fixed'] },
    discountValue: { type: Number, min: 0 },
    stock: { type: Number, required: true, default: 0, min: 0 },
    imageUrls: [{ type: String }],
    colors: [
      {
        name: String,
        hex: String,
        image: String,
      },
    ],
    sizes: [{ type: String }],
    specifications: [
      {
        name: String,
        value: String,
      },
    ],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

productSchema.index({ category: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ name: 'text', description: 'text' });

export const Product =
  mongoose.models.Product || mongoose.model<IProduct>('Product', productSchema);

// ==================== CATEGORY ====================

export interface ICategory extends Document {
  name: string;
  description?: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    imageUrl: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Category =
  mongoose.models.Category ||
  mongoose.model<ICategory>('Category', categorySchema);

// ==================== ORDER ====================

export interface IOrderItem {
  productId: mongoose.Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
}

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  items: IOrderItem[];
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
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: 'Product' },
        name: String,
        price: Number,
        quantity: Number,
        size: String,
        color: String,
      },
    ],
    totalAmount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    paymentMethod: String,
    shippingAddress: {
      fullName: String,
      phone: String,
      streetAddress: String,
      city: String,
      postalCode: String,
    },
    notes: String,
  },
  { timestamps: true }
);

orderSchema.index({ userId: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

export const Order =
  mongoose.models.Order || mongoose.model<IOrder>('Order', orderSchema);

// ==================== WISHLIST ====================

export interface IWishlistItem {
  productId: mongoose.Types.ObjectId;
  addedAt: Date;
}

export interface IWishlist extends Document {
  userId: mongoose.Types.ObjectId;
  items: IWishlistItem[];
  createdAt: Date;
  updatedAt: Date;
}

const wishlistSchema = new Schema<IWishlist>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: 'Product' },
        addedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export const Wishlist =
  mongoose.models.Wishlist ||
  mongoose.model<IWishlist>('Wishlist', wishlistSchema);

// ==================== HERO SLIDE ====================

export interface IHeroSlide extends Document {
  title: string;
  subtitle?: string;
  imageUrl: string;
  buttonText?: string;
  buttonLink?: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const heroSlideSchema = new Schema<IHeroSlide>(
  {
    title: { type: String, required: true },
    subtitle: String,
    imageUrl: { type: String, required: true },
    buttonText: String,
    buttonLink: String,
    isActive: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

heroSlideSchema.index({ isActive: 1, displayOrder: 1 });

export const HeroSlide =
  mongoose.models.HeroSlide ||
  mongoose.model<IHeroSlide>('HeroSlide', heroSlideSchema);

// ==================== FEATURED BANNER ====================

export interface IFeaturedBanner extends Document {
  title: string;
  subtitle?: string;
  imageUrl: string;
  buttonText?: string;
  buttonLink?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const featuredBannerSchema = new Schema<IFeaturedBanner>(
  {
    title: { type: String, required: true },
    subtitle: String,
    imageUrl: { type: String, required: true },
    buttonText: String,
    buttonLink: String,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const FeaturedBanner =
  mongoose.models.FeaturedBanner ||
  mongoose.model<IFeaturedBanner>('FeaturedBanner', featuredBannerSchema);

// ==================== COUPON ====================

export interface ICoupon extends Document {
  code: string;
  description?: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchaseAmount?: number;
  maxUsageCount?: number;
  usageCount: number;
  expiryDate?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const couponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true, uppercase: true },
    description: String,
    discountType: {
      type: String,
      enum: ['percentage', 'fixed'],
      required: true,
    },
    discountValue: { type: Number, required: true, min: 0 },
    minPurchaseAmount: { type: Number, min: 0 },
    maxUsageCount: { type: Number },
    usageCount: { type: Number, default: 0, min: 0 },
    expiryDate: Date,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

couponSchema.index({ code: 1 });
couponSchema.index({ isActive: 1 });

export const Coupon =
  mongoose.models.Coupon || mongoose.model<ICoupon>('Coupon', couponSchema);

// ==================== ADDRESS ====================

export interface IAddress extends Document {
  userId: mongoose.Types.ObjectId;
  fullName: string;
  phone: string;
  streetAddress: string;
  city: string;
  postalCode: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const addressSchema = new Schema<IAddress>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    streetAddress: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

addressSchema.index({ userId: 1 });

export const Address =
  mongoose.models.Address || mongoose.model<IAddress>('Address', addressSchema);
