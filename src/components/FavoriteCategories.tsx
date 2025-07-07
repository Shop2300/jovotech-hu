// src/components/FavoriteCategories.tsx
import Link from 'next/link';
import Image from 'next/image';

interface CategoryItem {
  name: string;
  slug: string;
  image: string;
}

const favoriteCategories: CategoryItem[] = [
  {
    name: 'Sport i rekreacja',
    slug: 'sport-i-rekreacja',
    image: '/images/favorite_categories/categories3.webp'
  },
  {
    name: 'Sprzęt czyszczący',
    slug: 'sprzet-czyszczacy',
    image: '/images/favorite_categories/categories1.webp'
  },
  {
    name: 'Ogród i trawnik',
    slug: 'ogrod-i-trawnik',
    image: '/images/favorite_categories/categories4.webp'
  },
  {
    name: 'Sprzęt rolniczy i leśny',
    slug: 'sprzet-rolniczy-i-lesny',
    image: '/images/favorite_categories/categories5.webp'
  },
  {
    name: 'Artykuły biurowe',
    slug: 'artyku-y-biurowe',
    image: '/images/favorite_categories/categories2.webp'
  }
];

export function FavoriteCategories() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-screen-2xl mx-auto px-6">
        <h2 className="text-2xl font-bold mb-8 text-center text-black">Ulubione kategorie</h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 lg:gap-6">
          {favoriteCategories.map((category) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className="group flex flex-col"
            >
              <div className="aspect-square relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 mb-3">
                <Image
                  src={category.image}
                  alt=""  // Empty alt since the category name is visible as text below
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
                />
              </div>
              
              <h3 className="text-gray-800 font-semibold text-sm lg:text-base text-center group-hover:underline transition-all duration-200">
                {category.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}