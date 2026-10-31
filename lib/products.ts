export interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
  description: string
  rating: number
  reviews: number
  inStock: boolean
  features?: string[]
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    price: 79.99,
    originalPrice: 99.99,
    image: '/wireless-headphones.png',
    category: 'Electronics',
    description: 'Premium wireless headphones with noise cancellation and 30-hour battery life.',
    rating: 4.5,
    reviews: 128,
    inStock: true,
    features: ['Noise Cancellation', '30h Battery', 'Wireless Charging', 'Premium Sound']
  },
  {
    id: '2',
    name: 'Smart Fitness Watch',
    price: 199.99,
    originalPrice: 249.99,
    image: '/fitness-smartwatch.png',
    category: 'Electronics',
    description: 'Advanced fitness tracking with heart rate monitor and GPS.',
    rating: 4.3,
    reviews: 89,
    inStock: true,
    features: ['Heart Rate Monitor', 'GPS Tracking', 'Water Resistant', '7-day Battery']
  },
  {
    id: '3',
    name: 'Organic Cotton T-Shirt',
    price: 29.99,
    image: '/organic-cotton-tshirt.png',
    category: 'Fashion',
    description: 'Comfortable organic cotton t-shirt in various colors.',
    rating: 4.7,
    reviews: 203,
    inStock: true,
    features: ['100% Organic Cotton', 'Eco-Friendly', 'Soft Fabric', 'Multiple Colors']
  },
  {
    id: '4',
    name: 'Stainless Steel Water Bottle',
    price: 24.99,
    image: '/stainless-steel-bottle.png',
    category: 'Home & Garden',
    description: 'Insulated stainless steel water bottle keeps drinks cold for 24 hours.',
    rating: 4.6,
    reviews: 156,
    inStock: true,
    features: ['24h Cold', '12h Hot', 'BPA Free', 'Leak Proof']
  },
  {
    id: '5',
    name: 'Gaming Mechanical Keyboard',
    price: 129.99,
    originalPrice: 159.99,
    image: '/gaming-mechanical-keyboard.png',
    category: 'Electronics',
    description: 'RGB backlit mechanical keyboard with customizable keys.',
    rating: 4.4,
    reviews: 94,
    inStock: true,
    features: ['RGB Backlight', 'Mechanical Switches', 'Programmable Keys', 'Gaming Mode']
  },
  {
    id: '6',
    name: 'Yoga Mat Premium',
    price: 39.99,
    image: '/premium-yoga-mat.png',
    category: 'Sports',
    description: 'Non-slip premium yoga mat with alignment lines.',
    rating: 4.8,
    reviews: 267,
    inStock: true,
    features: ['Non-Slip Surface', 'Alignment Lines', 'Eco-Friendly', 'Extra Thick']
  }
]

export function getProductById(id: string): Product | undefined {
  return products.find(product => product.id === id)
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter(product => product.category === category)
}

export function getFeaturedProducts(): Product[] {
  return products.slice(0, 4)
}
