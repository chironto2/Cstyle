import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET =
  process.env.JWT_SECRET || 'your_jwt_secret_change_this_in_production';

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(userId: string, role: string): string {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(
  token: string
): { userId: string; role: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      role: string;
    };
    return decoded;
  } catch (error) {
    return null;
  }
}

export function extractTokenFromHeader(authHeader?: string): string | null {
  if (!authHeader) return null;
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null;
  return parts[1];
}

export function calculateDiscount(
  price: number,
  discountType?: string,
  discountValue?: number
): number {
  if (!discountType || !discountValue || discountValue <= 0) return price;

  if (discountType === 'percentage') {
    return Math.max(0, price - (price * discountValue) / 100);
  } else if (discountType === 'fixed') {
    return Math.max(0, price - discountValue);
  }
  return price;
}
