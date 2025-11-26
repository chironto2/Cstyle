'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, LogIn, UserPlus } from 'lucide-react';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-primary text-primary-foreground shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Desktop Navigation */}
        <div className="flex justify-between items-center">
          <Link
            href="/"
            className="text-2xl md:text-3xl font-bold hover:opacity-90 transition-opacity"
          >
            Cstyle
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex gap-6 items-center">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              Home
            </Link>
            <Link href="/shop" className="hover:opacity-80 transition-opacity">
              Shop
            </Link>
            <Link href="/cart" className="hover:opacity-80 transition-opacity">
              Cart
            </Link>
            <div className="flex gap-2 flex-wrap">
              <Link
                href="/login"
                className="flex items-center gap-2 px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm"
              >
                <LogIn size={18} />
                <span className="hidden sm:inline">Login</span>
              </Link>
              <Link
                href="/register-user"
                className="flex items-center gap-2 px-3 py-2 bg-white hover:bg-gray-100 text-primary rounded-lg font-medium transition-colors text-sm"
              >
                <UserPlus size={18} />
                <span className="hidden sm:inline">Register</span>
              </Link>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <nav className="md:hidden mt-4 pt-4 border-t border-white/20 flex flex-col gap-3">
            <Link href="/" className="py-2 hover:opacity-80 transition-opacity">
              Home
            </Link>
            <Link
              href="/shop"
              className="py-2 hover:opacity-80 transition-opacity"
            >
              Shop
            </Link>
            <Link
              href="/cart"
              className="py-2 hover:opacity-80 transition-opacity"
            >
              Cart
            </Link>
            <div className="flex flex-col gap-2 pt-3 border-t border-white/20">
              <Link
                href="/login"
                className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              >
                <LogIn size={18} />
                <span>Login</span>
              </Link>
              <Link
                href="/register-user"
                className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-white hover:bg-gray-100 text-primary rounded-lg font-medium transition-colors"
              >
                <UserPlus size={18} />
                <span>Register</span>
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
