// src/app/page.tsx
import { prisma } from '@/lib/prisma';
import { ProductCard } from '@/components/ProductCard';

async function getProducts() {
  const products = await prisma.product.findMany({
    take: 6,
    orderBy: { createdAt: 'desc' }
  });
  
  // Convert Decimal to number for the client
  return products.map(product => ({
    ...product,
    price: Number(product.price)
  }));
}

export default async function HomePage() {
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Vítejte v našem e-shopu!</h2>
          <p className="text-xl mb-8">Kvalitní produkty s rychlým doručením</p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
            Prohlédnout produkty
          </button>
        </div>
      </section>

      {/* Products Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Naše produkty</h2>
        
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Zatím nemáme žádné produkty.</p>
            <p className="text-gray-500 mt-2">Přidejte první produkt do databáze!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Features */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="font-semibold mb-2">Doprava zdarma</h3>
              <p className="text-gray-600">Při nákupu nad 1000 Kč</p>
            </div>
            <div>
              <div className="text-4xl mb-4">📦</div>
              <h3 className="font-semibold mb-2">Zásilkovna</h3>
              <p className="text-gray-600">7000+ výdejních míst</p>
            </div>
            <div>
              <div className="text-4xl mb-4">💳</div>
              <h3 className="font-semibold mb-2">Platba kartou</h3>
              <p className="text-gray-600">Nebo na dobírku</p>
            </div>
            <div>
              <div className="text-4xl mb-4">↩️</div>
              <h3 className="font-semibold mb-2">14 dní na vrácení</h3>
              <p className="text-gray-600">Bez udání důvodu</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; 2024 Můj E-shop. Všechna práva vyhrazena.</p>
        </div>
      </footer>
    </main>
  );
}