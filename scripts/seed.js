/**
 * Seed Script - Initializes database with default data
 * Run with: npm run seed
 */

require('dotenv').config({ path: '.env.local' });

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in environment variables');
  process.exit(1);
}

// Define schemas for seeding
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  phone: String,
  avatar: String,
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isActive: Boolean,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const categorySchema = new mongoose.Schema({
  name: String,
  description: String,
  imageUrl: String,
  isActive: Boolean,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const productSchema = new mongoose.Schema({
  name: String,
  category: String,
  description: String,
  price: Number,
  discountType: String,
  discountValue: Number,
  stock: Number,
  imageUrls: [String],
  colors: [
    {
      name: String,
      hex: String,
      image: String,
    },
  ],
  sizes: [String],
  specifications: [
    {
      name: String,
      value: String,
    },
  ],
  isActive: Boolean,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);
const Category = mongoose.model('Category', categorySchema);
const Product = mongoose.model('Product', productSchema);

async function seed() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});

    // Create admin user
    console.log('👤 Creating admin user...');
    const hashedAdminPassword = await bcrypt.hash('Admin@123', 10);
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@demo.com',
      phone: '+1-234-567-8900',
      password: hashedAdminPassword,
      role: 'admin',
      isActive: true,
    });
    console.log(
      '✅ Admin created - Email: admin@demo.com, Password: Admin@123'
    );

    // Create demo customer users
    console.log('👤 Creating demo customer users...');
    const hashedDemoPassword = await bcrypt.hash('Demo@123', 10);
    const demoUsers = await User.insertMany([
      {
        name: 'Demo Customer 1',
        email: 'customer1@demo.com',
        phone: '+1-555-0101',
        password: hashedDemoPassword,
        role: 'user',
        isActive: true,
      },
      {
        name: 'Demo Customer 2',
        email: 'customer2@demo.com',
        phone: '+1-555-0102',
        password: hashedDemoPassword,
        role: 'user',
        isActive: true,
      },
    ]);
    console.log(
      '✅ 2 demo customers created - Password: Demo@123'
    );

    // Create additional regular users for testing
    console.log('👤 Creating additional test users...');
    const hashedUserPassword = await bcrypt.hash('Test@123', 10);
    const regularUsers = await User.insertMany([
      {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1-555-0103',
        password: hashedUserPassword,
        role: 'user',
        isActive: true,
      },
      {
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        phone: '+1-555-0104',
        password: hashedUserPassword,
        role: 'user',
        isActive: true,
      },
    ]);
    console.log('✅ 2 additional test users created - Password: Test@123');

    // Create categories
    console.log('📂 Creating categories...');
    const categories = await Category.insertMany([
      {
        name: 'Men',
        description: 'Mens clothing collection - Trendy and comfortable styles for the modern man',
        imageUrl: 'https://images.unsplash.com/photo-1516217343722-142e0fc0c4b6?w=500&h=500&fit=crop',
        isActive: true,
      },
      {
        name: 'Women',
        description: 'Womens clothing collection - Elegant and stylish pieces for every occasion',
        imageUrl: 'https://images.unsplash.com/photo-1595777707802-21b82ca8b0e2?w=500&h=500&fit=crop',
        isActive: true,
      },
      {
        name: 'Kids',
        description: 'Kids clothing collection - Fun and comfortable outfits for children',
        imageUrl: 'https://images.unsplash.com/photo-1514369509822-461ebf604b3b?w=500&h=500&fit=crop',
        isActive: true,
      },
      {
        name: 'Accessories',
        description: 'Fashion accessories - Complete your look with our collection of accessories',
        imageUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop',
        isActive: true,
      },
    ]);
    console.log('✅ 4 categories created');

    // Create sample products with better demo images
    console.log('🛍️  Creating sample products...');
    const products = await Product.insertMany([
      {
        name: 'Classic Cotton T-Shirt',
        category: 'Men',
        description:
          'Comfortable and durable cotton t-shirt perfect for everyday wear. Made from 100% premium cotton with a soft feel.',
        price: 29.99,
        discountType: 'percentage',
        discountValue: 10,
        stock: 150,
        imageUrls: [
          'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop',
          'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=500&h=500&fit=crop',
        ],
        colors: [
          {
            name: 'Black',
            hex: '#000000',
            image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=50&h=50&fit=crop',
          },
          {
            name: 'White',
            hex: '#FFFFFF',
            image: 'https://images.unsplash.com/photo-1542272604-787c62e4beeb?w=50&h=50&fit=crop',
          },
          {
            name: 'Navy Blue',
            hex: '#001f3f',
            image: 'https://images.unsplash.com/photo-1506629082632-2d716eb34784?w=50&h=50&fit=crop',
          },
        ],
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        specifications: [
          { name: 'Material', value: '100% Premium Cotton' },
          { name: 'Care', value: 'Machine wash cold with similar colors' },
          { name: 'Fit', value: 'Regular fit' },
        ],
        isActive: true,
      },
      {
        name: 'Premium Denim Jeans',
        category: 'Women',
        description:
          'Stylish and comfortable premium denim jeans for all occasions. High-quality fabric with a perfect fit for your body.',
        price: 79.99,
        discountType: 'fixed',
        discountValue: 10,
        stock: 80,
        imageUrls: [
          'https://images.unsplash.com/photo-1542272898-be0055dcd87c?w=500&h=500&fit=crop',
          'https://images.unsplash.com/photo-1505503693641-c55953c938d3?w=500&h=500&fit=crop',
        ],
        colors: [
          {
            name: 'Dark Blue',
            hex: '#00008B',
            image: 'https://images.unsplash.com/photo-1542272898-be0055dcd87c?w=50&h=50&fit=crop',
          },
          {
            name: 'Light Blue',
            hex: '#87CEEB',
            image: 'https://images.unsplash.com/photo-1505503693641-c55953c938d3?w=50&h=50&fit=crop',
          },
          {
            name: 'Black',
            hex: '#000000',
            image: 'https://images.unsplash.com/photo-1542272604-787c62e4beeb?w=50&h=50&fit=crop',
          },
        ],
        sizes: ['24', '26', '28', '30', '32', '34'],
        specifications: [
          { name: 'Material', value: '98% Cotton, 2% Elastane' },
          { name: 'Rise', value: 'Mid-rise' },
          { name: 'Style', value: 'Slim fit' },
        ],
        isActive: true,
      },
      {
        name: 'Kids Summer Dress',
        category: 'Kids',
        description: 'Adorable and colorful summer dress for kids. Perfect for playtime or casual outings with comfortable fabric.',
        price: 39.99,
        stock: 120,
        imageUrls: [
          'https://images.unsplash.com/photo-1587361137199-a0d75ea1c047?w=500&h=500&fit=crop',
          'https://images.unsplash.com/photo-1585221579141-e3bfe2e93e90?w=500&h=500&fit=crop',
        ],
        colors: [
          {
            name: 'Pink',
            hex: '#FFC0CB',
            image: 'https://images.unsplash.com/photo-1587361137199-a0d75ea1c047?w=50&h=50&fit=crop',
          },
          {
            name: 'Purple',
            hex: '#800080',
            image: 'https://images.unsplash.com/photo-1585221579141-e3bfe2e93e90?w=50&h=50&fit=crop',
          },
          {
            name: 'Yellow',
            hex: '#FFFF00',
            image: 'https://images.unsplash.com/photo-1575928865208-e8b8ee8e2a11?w=50&h=50&fit=crop',
          },
        ],
        sizes: ['2-3Y', '4-5Y', '6-7Y', '8-9Y', '10-11Y'],
        specifications: [
          { name: 'Material', value: '100% Cotton Blend' },
          { name: 'Sleeve', value: 'Short sleeves' },
          { name: 'Care', value: 'Gentle wash with warm water' },
        ],
        isActive: true,
      },
      {
        name: 'Leather Handbag',
        category: 'Accessories',
        description: 'Elegant leather handbag perfect for everyday use or special occasions. Premium leather with spacious compartments.',
        price: 149.99,
        discountType: 'percentage',
        discountValue: 15,
        stock: 50,
        imageUrls: [
          'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=500&h=500&fit=crop',
          'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&h=500&fit=crop',
        ],
        colors: [
          {
            name: 'Black',
            hex: '#000000',
            image: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=50&h=50&fit=crop',
          },
          {
            name: 'Brown',
            hex: '#8B4513',
            image: 'https://images.unsplash.com/photo-1614181273555-e56f4c4c5a73?w=50&h=50&fit=crop',
          },
          {
            name: 'Red',
            hex: '#FF0000',
            image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=50&h=50&fit=crop',
          },
        ],
        sizes: [],
        specifications: [
          { name: 'Material', value: 'Genuine Leather' },
          { name: 'Compartments', value: '3 main + 6 smaller + 2 side pockets' },
          { name: 'Dimensions', value: '14"W x 11"H x 5"D' },
        ],
        isActive: true,
      },
      {
        name: 'Running Shoes',
        category: 'Men',
        description: 'Professional running shoes with advanced cushioning technology. Perfect for athletes and casual runners.',
        price: 119.99,
        stock: 200,
        imageUrls: [
          'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=500&h=500&fit=crop',
          'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop',
        ],
        colors: [
          {
            name: 'Black/White',
            hex: '#000000',
            image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=50&h=50&fit=crop',
          },
          {
            name: 'Blue/White',
            hex: '#0000FF',
            image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=50&h=50&fit=crop',
          },
        ],
        sizes: ['5', '6', '7', '8', '9', '10', '11', '12', '13'],
        specifications: [
          { name: 'Material', value: 'Mesh and Synthetic Upper' },
          { name: 'Sole', value: 'Rubber' },
          { name: 'Closure', value: 'Lace-up' },
        ],
        isActive: true,
      },
      {
        name: 'Casual Blazer',
        category: 'Women',
        description: 'Versatile casual blazer that works for both office and weekend wear. Made from premium fabric with perfect tailoring.',
        price: 99.99,
        discountType: 'percentage',
        discountValue: 5,
        stock: 60,
        imageUrls: [
          'https://images.unsplash.com/photo-1595777707802-21b82ca8b0e2?w=500&h=500&fit=crop',
          'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=500&h=500&fit=crop',
        ],
        colors: [
          {
            name: 'Navy',
            hex: '#001f3f',
            image: 'https://images.unsplash.com/photo-1595777707802-21b82ca8b0e2?w=50&h=50&fit=crop',
          },
          {
            name: 'Black',
            hex: '#000000',
            image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=50&h=50&fit=crop',
          },
          {
            name: 'Beige',
            hex: '#F5F5DC',
            image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=50&h=50&fit=crop',
          },
        ],
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        specifications: [
          { name: 'Material', value: '65% Polyester, 35% Viscose' },
          { name: 'Closure', value: 'Button' },
          { name: 'Fit', value: 'Tailored fit' },
        ],
        isActive: true,
      },
    ]);
    console.log('✅ 6 sample products created');

    console.log('\n🎉 Database seeded successfully!\n');
    console.log('📝 Demo Credentials:');
    console.log('   👤 Admin User:');
    console.log('      Email: admin@demo.com');
    console.log('      Password: Admin@123');
    console.log('');
    console.log('   🛍️  Demo Customer 1:');
    console.log('      Email: customer1@demo.com');
    console.log('      Password: Demo@123');
    console.log('');
    console.log('   🛍️  Demo Customer 2:');
    console.log('      Email: customer2@demo.com');
    console.log('      Password: Demo@123');
    console.log('');
    console.log('   📧 Test Users:');
    console.log('      Password: Test@123');
    console.log('      Emails: john@example.com, sarah@example.com\n');
    console.log('📊 Database Summary:');
    console.log('   - 1 Admin User');
    console.log('   - 2 Demo Customer Users');
    console.log('   - 2 Test Users');
    console.log('   - 4 Categories');
    console.log('   - 6 Products');
    console.log('\n💡 Tip: Use demo credentials to test the application. Admin can manage products and dashboard.\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
}

seed();

seed();
