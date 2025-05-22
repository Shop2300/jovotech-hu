import { prisma } from '@/lib/prisma';
import { formatPrice } from '@/lib/utils';

async function getProducts() {
  const products = await prisma.product.findMany({
    take: 6,
    orderBy: { createdAt: 'desc' }
  });
  return products;
}

export default async function HomePage() {
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-blue-600">Můj E-shop</h1>
            <nav className="flex gap-6">
              <a href="/" className="text-gray-700 hover:text-blue-600">Domů</a>
              <a href="/products" className="text-gray-700 hover:text-blue-600">Produkty</a>
              <a href="/cart" className="text-gray-700 hover:text-blue-600">Košík</a>
            </nav>
          </div>
        </div>
      </header>

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
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  {product.image ? (
                    <img src={product.image} alt={product.nameCs} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-gray-400">Obrázek produktu</span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{product.nameCs}</h3>
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-blue-600">
                      {formatPrice(Number(product.price))}
                    </span>
                    <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">
                      Do košíku
                    </button>
                  </div>
                </div>
              </div>
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