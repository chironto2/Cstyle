'use client';

import React from 'react';
import Header from './Header';

export default function MainLayoutWrapper({
  children,
  footer,
}: {
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
      {footer}
    </>
  );
}
