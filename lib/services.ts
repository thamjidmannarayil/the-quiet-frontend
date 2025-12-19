export interface Service {
  id: string
  name: string
  price: number
  image: string
  category: string
  duration: string
  description: string
  rating: number
  reviews: number
  available: boolean
  features?: string[]
  includes?: string[]
}

export const services: Service[] = [
  {
    id: '1',
    name: 'Luxury Spa Treatment',
    price: 299,
    image: '/luxury-spa-treatment.png',
    category: 'Spa & Wellness',
    duration: '90 minutes',
    description: 'Indulge in our signature spa treatment featuring hot stone massage, aromatherapy, and rejuvenating facial.',
    rating: 4.9,
    reviews: 156,
    available: true,
    features: ['Hot Stone Massage', 'Aromatherapy', 'Facial Treatment', 'Relaxation Lounge'],
    includes: ['Welcome drink', 'Spa amenities', 'Relaxation time']
  },
  {
    id: '2',
    name: 'Sunset Dinner Cruise',
    price: 189,
    image: '/sunset-dinner-cruise.png',
    category: 'Dining & Entertainment',
    duration: '3 hours',
    description: 'Romantic sunset cruise with gourmet dinner, live music, and breathtaking ocean views.',
    rating: 4.8,
    reviews: 203,
    available: true,
    features: ['Gourmet 5-course meal', 'Live music', 'Open bar', 'Professional photography'],
    includes: ['Transportation', 'All meals', 'Beverages', 'Entertainment']
  },
  {
    id: '3',
    name: 'Water Sports Adventure',
    price: 149,
    image: '/water-sports-adventure.png',
    category: 'Activities & Sports',
    duration: '4 hours',
    description: 'Thrilling water sports package including jet skiing, parasailing, and snorkeling.',
    rating: 4.7,
    reviews: 89,
    available: true,
    features: ['Jet Skiing', 'Parasailing', 'Snorkeling', 'Professional Instructor'],
    includes: ['All equipment', 'Safety gear', 'Instructor', 'Light refreshments']
  },
  {
    id: '4',
    name: 'Private Beach Cabana',
    price: 399,
    image: '/private-beach-cabana.png',
    category: 'Accommodation',
    duration: 'Full day',
    description: 'Exclusive beachfront cabana with personal butler service and premium amenities.',
    rating: 4.9,
    reviews: 124,
    available: true,
    features: ['Private Beach Access', 'Butler Service', 'Premium Amenities', 'Beachfront Location'],
    includes: ['Personal butler', 'Food & beverages', 'Beach equipment', 'WiFi']
  },
  {
    id: '5',
    name: 'Island Hopping Tour',
    price: 229,
    image: '/island-hopping-tour.png',
    category: 'Tours & Excursions',
    duration: '6 hours',
    description: 'Explore pristine islands with snorkeling, beach picnic, and cultural experiences.',
    rating: 4.6,
    reviews: 167,
    available: true,
    features: ['Multiple Islands', 'Snorkeling', 'Beach Picnic', 'Cultural Sites'],
    includes: ['Boat transportation', 'Lunch', 'Snorkeling gear', 'Guide']
  },
  {
    id: '6',
    name: 'Couples Yoga Session',
    price: 129,
    image: '/couples-yoga-session.png',
    category: 'Spa & Wellness',
    duration: '60 minutes',
    description: 'Private yoga session for couples on the beach at sunrise or sunset.',
    rating: 4.8,
    reviews: 78,
    available: true,
    features: ['Private Session', 'Beach Location', 'Professional Instructor', 'Meditation'],
    includes: ['Yoga mats', 'Towels', 'Water', 'Relaxation time']
  }
]

export function getServiceById(id: string): Service | undefined {
  return services.find(service => service.id === id)
}

export function getServicesByCategory(category: string): Service[] {
  return services.filter(service => service.category === category)
}

export function getFeaturedServices(): Service[] {
  return services.slice(0, 3)
}
