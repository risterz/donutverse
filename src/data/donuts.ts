export type DonutCategory = 'All' | 'Fruity' | 'Chocolate' | 'Classic & Tea';

export interface DonutProduct {
  id: string;
  name: string;
  price: number;
  category: Exclude<DonutCategory, 'All'>;
  description: string;
  tastingNote: string;
  image: string;
  accentBg: string;
  badge?: string;
  glazeHex: string;
  sprinklePalette: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  review: string;
  favoriteFlavor: string;
  avatar: string;
}

export interface BoutiqueLocation {
  id: string;
  city: string;
  name: string;
  address: string;
  hours: string;
  phone: string;
  note: string;
}

export const DONUT_CATEGORIES: DonutCategory[] = [
  'All',
  'Fruity',
  'Chocolate',
  'Classic & Tea',
];

export const DONUTS: DonutProduct[] = [
  {
    id: 'strawberry-dream',
    name: 'Strawberry Dream',
    price: 8.9,
    category: 'Fruity',
    description:
      'Pillow-soft 18-hour brioche dipped in Cameron Highlands strawberry cream glaze and finished with ruby freeze-dried berry shards.',
    tastingNote: 'Bright berry · Silky cream',
    image: '/images/donut-strawberry-dream.jpg',
    accentBg: '#FCE4EC',
    badge: 'House Favorite',
    glazeHex: '#F06A8A',
    sprinklePalette: ['#FFF8F1', '#D92B4B', '#FFD1DC', '#F5C469'],
  },
  {
    id: 'belgian-chocolate-bliss',
    name: 'Belgian Chocolate Bliss',
    price: 9.9,
    category: 'Chocolate',
    description:
      'Enrobed in mirror-gloss 70% dark Belgian couverture ganache, crowned with delicate hand-shaved chocolate curls and raw cocoa.',
    tastingNote: 'Deep cacao · Velvety finish',
    image: '/images/donut-belgian-chocolate.jpg',
    accentBg: '#F3E5DC',
    badge: 'Rich & Bold',
    glazeHex: '#3A1C14',
    sprinklePalette: ['#E3A45B', '#FFF8F1', '#C87D55', '#F6C2CC'],
  },
  {
    id: 'matcha-cloud',
    name: 'Matcha Cloud',
    price: 10.9,
    category: 'Classic & Tea',
    description:
      'First-harvest ceremonial Uji matcha folded into a cloud-light glaze, laced with crisp white chocolate ribbons and roasted pistachio.',
    tastingNote: 'Umami tea · Toasted nut',
    image: '/images/donut-matcha-cloud.jpg',
    accentBg: '#EAF0E4',
    badge: 'Small Batch',
    glazeHex: '#6F9357',
    sprinklePalette: ['#FFFDF9', '#C7DEC0', '#F5D6A8', '#3F5D33'],
  },
  {
    id: 'classic-glazed',
    name: 'Classic Glazed',
    price: 6.9,
    category: 'Classic & Tea',
    description:
      'Our golden-brown signature ring lacquered warm in translucent Madagascar vanilla bean and wildflower honey glaze.',
    tastingNote: 'Warm brioche · Vanilla bean',
    image: '/images/donut-classic-glazed.jpg',
    accentBg: '#FBF0DE',
    glazeHex: '#F3D6A4',
    sprinklePalette: ['#FFFDF9', '#D98A3C', '#FCE4EC'],
  },
  {
    id: 'oreo-crunch',
    name: 'Oreo Crunch',
    price: 9.9,
    category: 'Chocolate',
    description:
      'Whipped sweet-cream glaze generously crusted in dark chocolate sandwich cookie crumble and drizzled with bittersweet fudge.',
    tastingNote: 'Sweet cream · Cocoa crunch',
    image: '/images/donut-oreo-crunch.jpg',
    accentBg: '#F1EAE6',
    glazeHex: '#F4ECE4',
    sprinklePalette: ['#2A1510', '#4A2C23', '#FFF8F1', '#8A5F52'],
  },
  {
    id: 'raspberry-velvet',
    name: 'Raspberry Velvet',
    price: 11.9,
    category: 'Fruity',
    description:
      'Tangy slow-simmered crimson raspberry compote glaze topped with crisp blush meringue crumble and a fresh ruby berry.',
    tastingNote: 'Tart crimson · Crisp meringue',
    image: '/images/donut-raspberry-velvet.jpg',
    accentBg: '#FBE0E6',
    badge: 'Limited Glaze',
    glazeHex: '#B81D42',
    sprinklePalette: ['#FFF8F1', '#F7C9D8', '#FFD9E3', '#F5C469'],
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'review-aisyah',
    name: 'Aisyah Rahman',
    location: 'Bangsar, Kuala Lumpur',
    rating: 5,
    review:
      'The Strawberry Dream tastes like real sun-ripened berries rather than artificial syrup. Still warm and cloud-soft when I picked up my morning box.',
    favoriteFlavor: 'Strawberry Dream',
    avatar: '/images/avatar-aisyah.jpg',
  },
  {
    id: 'review-daniel',
    name: 'Daniel Tan',
    location: 'Mont Kiara, Kuala Lumpur',
    rating: 5,
    review:
      'Brought a dozen Belgian Chocolate Bliss and Matcha Cloud to our studio Friday. Not a single crumb survived ten minutes. Easily the best brioche dough in town.',
    favoriteFlavor: 'Belgian Chocolate Bliss',
    avatar: '/images/avatar-daniel.jpg',
  },
  {
    id: 'review-priya',
    name: 'Priya Nair',
    location: 'George Town, Penang',
    rating: 5,
    review:
      'Every detail feels thoughtful, from the pastel box to the tangy Raspberry Velvet glaze. It is sweet without ever feeling heavy.',
    favoriteFlavor: 'Raspberry Velvet',
    avatar: '/images/avatar-priya.jpg',
  },
];

export const LOCATIONS: BoutiqueLocation[] = [
  {
    id: 'bangsar',
    city: 'Kuala Lumpur',
    name: 'Bangsar Flagship Kitchen',
    address: '28 Jalan Telawi 3, Bangsar Baru, 59100 Kuala Lumpur',
    hours: 'Daily · 8:00 AM to 9:00 PM',
    phone: '+60 3-2201 8490',
    note: 'Watch our bakers hand-dip fresh batches every two hours.',
  },
  {
    id: 'pavilion',
    city: 'Kuala Lumpur',
    name: 'Bukit Bintang Tasting Bar',
    address: 'Lot 3.14, Level 3, Jalan Bukit Bintang, 55100 Kuala Lumpur',
    hours: 'Daily · 10:00 AM to 10:00 PM',
    phone: '+60 3-2110 4218',
    note: 'Espresso pairings and curated 6-piece gift boxes ready to carry.',
  },
  {
    id: 'penang',
    city: 'Penang',
    name: 'George Town Heritage Atelier',
    address: '64 Lebuh Pantai, George Town, 10300 Pulau Pinang',
    hours: 'Tue to Sun · 9:00 AM to 8:00 PM',
    phone: '+60 4-261 7302',
    note: 'Sunlit courtyard seating with weekend-only seasonal fruit glazes.',
  },
];

export function formatMYR(amount: number): string {
  return `RM ${amount.toFixed(2)}`;
}
