'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function InteractiveProductCard({ product }: any) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <h3 className="font-bold">{product.name || 'Product'}</h3>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">${product.price || 0}</p>
        <Button className="mt-4 w-full">Add to Cart</Button>
      </CardContent>
    </Card>
  );
}
