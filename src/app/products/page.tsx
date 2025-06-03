// src/app/products/page.tsx
import { prisma } from '@/lib/prisma';
import { ProductCard } from '@/components/ProductCard';

async function getProducts() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' }
  });
  
  // Convert Decimal to number for the client
  return products.map(product => ({
    ...product,
    price: Number(product.price)
  }));
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-black">Všechny produkty</h1>
        
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-black text-lg">Zatím nemáme žádné produkty.</p>
            <p className="text-gray-600 mt-2">Přidejte první produkt do databáze!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={{
    ...product,
    price: Number(product.price),
    regularPrice: product.regularPrice ? Number(product.regularPrice) : null
  }} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}