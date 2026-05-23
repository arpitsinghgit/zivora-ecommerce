import fs from 'fs';

const PRODUCTS = [
  {
    id: 'press-on-chandni-pearl',
    name: 'Chandni Pearl Glazed Set',
    category: 'press-on',
    categoryLabel: 'Press-On Nails',
    price: 599,
    originalPrice: 749,
    rating: 4.9,
    reviewCount: 342,
    description: 'Get that dreamy desi-chic chrome pearl finish inspired by moonlit Indian weddings. These salon-quality reusable press-on nails give you a signature bridal glow in under 10 minutes — perfect for shaadi season, Karva Chauth, or Diwali parties.',
    features: [
      'Reusable up to 5 times with proper care',
      'Non-damaging salon-grade adhesive tabs & liquid glue included',
      'Ultra-flex technology for comfortable, seamless natural fit on Indian nail beds',
      'Waterproof and chip-resistant coating — survives mehendi, haldi & kitchen work'
    ],
    images: [
      'https://images.pexels.com/photos/10609757/pexels-photo-10609757.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
      'https://images.pexels.com/photos/2281695/pexels-photo-2281695.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
      'https://images.pexels.com/photos/5484948/pexels-photo-5484948.png?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200'
    ],
    shapes: ['Almond', 'Oval', 'Coffin'],
    sizes: ['XS', 'S', 'M', 'L', 'Custom'],
    tags: ['glazed', 'chrome', 'nude', 'bridal', 'wedding'],
    inStock: true,
    bestSeller: true,
    newArrival: false
  },
  {
    id: 'press-on-shaadi-maroon',
    name: 'Shaadi Special Maroon Set',
    category: 'press-on',
    categoryLabel: 'Press-On Nails',
    price: 499,
    rating: 4.8,
    reviewCount: 278,
    description: 'Deep, rich maroon that matches your bridal lehenga perfectly. This luxurious dark tone offers ultimate sophistication for Indian weddings, sangeet nights, and festive celebrations. Designed in a high-gloss gel finish that looks freshly done at a premium Mumbai salon.',
    features: [
      'Stays vibrant and glossy for up to 2 weeks through Indian festivities',
      'Includes prep pad, cuticle pusher, and nail file',
      'Eco-friendly materials, cruelty-free and vegan formula',
      'Custom sizing templates to ensure perfect fit for Indian hands'
    ],
    images: [
      'https://images.pexels.com/photos/2281695/pexels-photo-2281695.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
      'https://images.pexels.com/photos/10609757/pexels-photo-10609757.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800'
    ],
    shapes: ['Almond', 'Coffin', 'Square'],
    sizes: ['XS', 'S', 'M', 'L'],
    tags: ['bridal', 'maroon', 'wedding', 'festive', 'karva-chauth'],
    inStock: true,
    bestSeller: true,
    newArrival: true
  },
  {
    id: 'press-on-desi-french',
    name: 'Desi French Tip Set',
    category: 'press-on',
    categoryLabel: 'Press-On Nails',
    price: 549,
    originalPrice: 699,
    rating: 4.7,
    reviewCount: 214,
    description: 'A contemporary desi take on the timeless French manicure. Features micro-fine pastel tips over a flawless translucent peach base that complements Indian wheatish to dusky skin tones beautifully. Perfect for everyday office wear, college, or subtle bridal looks.',
    features: [
      'Double UV-cured gel surface coating',
      'Slightly curved design fits Indian nailbeds perfectly',
      'Includes both temporary gel tabs and extra strength 14-day glue',
      'Zero fading, zero chipping, vegan-friendly plastic formulation'
    ],
    images: [
      'https://images.pexels.com/photos/5484948/pexels-photo-5484948.png?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
      'https://images.pexels.com/photos/6135681/pexels-photo-6135681.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200'
    ],
    shapes: ['Almond', 'Oval', 'Square'],
    sizes: ['XS', 'S', 'M', 'L'],
    tags: ['french-tip', 'office-wear', 'minimal', 'daily-wear'],
    inStock: true,
    bestSeller: false,
    newArrival: false
  },
  {
    id: 'press-on-hariyali-velvet',
    name: 'Hariyali Velvet Cat Eye',
    category: 'press-on',
    categoryLabel: 'Press-On Nails',
    price: 649,
    rating: 5.0,
    reviewCount: 167,
    description: 'Inspired by the lush greens of the Indian monsoon. These stunning deep emerald press-ons reflect light at every angle, creating a mesmerizing cat-eye shimmer that shifts dynamically — perfect for Teej, Eid, or a bold statement at cocktail parties.',
    features: [
      'Premium magnetic gel coating for deep 3D velvet effect',
      'Thicker reinforced tips prevent bending and splitting',
      'Fits comfortably like a custom salon acrylic set',
      'Contains 30 nails in 15 sizes per set to ensure complete fit'
    ],
    images: [
      'https://images.pexels.com/photos/10592995/pexels-photo-10592995.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
      'https://images.pexels.com/photos/7755287/pexels-photo-7755287.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200'
    ],
    shapes: ['Coffin', 'Almond', 'Stiletto'],
    sizes: ['S', 'M', 'L'],
    tags: ['cat-eye', 'velvet', 'magnetic', 'green', 'festive'],
    inStock: true,
    bestSeller: false,
    newArrival: true
  },
  {
    id: 'polish-gulaabi-nude',
    name: 'Gulaabi Nude Gel Polish',
    category: 'polish',
    categoryLabel: 'Gel Polish',
    price: 349,
    originalPrice: 449,
    rating: 4.6,
    reviewCount: 198,
    description: 'The ultimate sheer pinkish-nude gel polish specially formulated for Indian skin tones. This self-leveling, highly pigmented formula gives you streak-free coverage in just two thin coats — from fair to deep dusky complexions.',
    features: [
      'Professional grade HEMA-free formula safe for Indian nails',
      'Cures in just 60 seconds under LED/UV lamps',
      'Up to 21 days of high-shine wear without lifting in humid Indian weather',
      'Cruelty-free, vegan, and 10-free certified toxin free'
    ],
    images: [
      'https://images.pexels.com/photos/12571010/pexels-photo-12571010.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
      'https://images.pexels.com/photos/20849460/pexels-photo-20849460.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800'
    ],
    colors: [
      { name: 'Soft Peach Blush', hex: '#ffdcd2' },
      { name: 'Warm Nude Dune', hex: '#e8cbb6' },
      { name: 'Milky Coconut', hex: '#fdfcf7' }
    ],
    tags: ['gel-polish', 'nude', 'sheer', 'indian-skin', 'daily'],
    inStock: true,
    bestSeller: true,
    newArrival: false
  },
  {
    id: 'polish-pista-green',
    name: 'Pista Green Gel Polish',
    category: 'polish',
    categoryLabel: 'Gel Polish',
    price: 349,
    rating: 4.8,
    reviewCount: 145,
    description: 'A muted, earthy pista green that feels fresh yet subtle — inspired by Indian mithai and spring festivals. This velvety smooth polish is a modern neutral, adding a quiet pop of personality to your everyday manicure that stands out in Indian offices.',
    features: [
      'Rich cream texture, no streaks, high opacity in 2 coats',
      'UV/LED curable — salon standard finish',
      'Safe for natural nails, supports nail strengthening',
      'Beautiful luxury glass bottle with ergonomic wide brush'
    ],
    images: [
      'https://images.pexels.com/photos/7615877/pexels-photo-7615877.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
      'https://images.pexels.com/photos/20849460/pexels-photo-20849460.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800'
    ],
    colors: [
      { name: 'Pistachio Sage', hex: '#a8bfa1' },
      { name: 'Olive Grove', hex: '#6b7d60' }
    ],
    tags: ['pastel', 'green', 'gel', 'cream', 'festive'],
    inStock: true,
    bestSeller: false,
    newArrival: true
  },
  {
    id: 'art-care-desi-glow-lamp',
    name: 'Desi Glow UV/LED Nail Lamp',
    category: 'art-care',
    categoryLabel: 'Care & Art Tools',
    price: 1299,
    originalPrice: 1699,
    rating: 4.9,
    reviewCount: 410,
    description: 'A professional 48W smart LED lamp designed for Indian homes — compact enough for Mumbai apartments, powerful enough for Delhi salons. Cures gel polishes safely and evenly in seconds with features like infrared sensors, multiple timer modes, and a removable base for pedicure use.',
    features: [
      '48W power with 30 strategically placed dual light beads',
      'Smart sensor auto turn on/off and digital countdown display',
      '4 timer options: 10s, 30s, 60s, and 99s low-heat mode',
      'Eye-friendly light shielding, lightweight and travel-friendly for Indian weddings'
    ],
    images: [
      'https://images.pexels.com/photos/6135684/pexels-photo-6135684.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
      'https://images.pexels.com/photos/6135673/pexels-photo-6135673.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200'
    ],
    tags: ['equipment', 'curing-lamp', 'must-have', 'pro-kit', 'salon'],
    inStock: true,
    bestSeller: true,
    newArrival: false
  },
  {
    id: 'art-care-gulab-badam-oil',
    name: 'Gulab & Badam Cuticle Oil',
    category: 'art-care',
    categoryLabel: 'Care & Art Tools',
    price: 399,
    rating: 4.9,
    reviewCount: 253,
    description: 'Formulated with organic Kashmiri rosehip, cold-pressed sweet almond (badam) oil, and vitamin E. This luxury fast-absorbing treatment hydrates, repairs, and strengthens damaged cuticles and nail beds — inspired by ancient Indian Ayurvedic beauty rituals.',
    features: [
      '100% natural, organic ingredients with real rose petals',
      'Helps prevent hangnails, peeling, and nail brittleness from Indian hard water',
      'Elegant dropper bottle for mess-free, targeted application',
      'Soothing natural aromatherapy scent of fresh desi gulab'
    ],
    images: [
      'https://images.pexels.com/photos/20849460/pexels-photo-20849460.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
      'https://images.pexels.com/photos/7615877/pexels-photo-7615877.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800'
    ],
    tags: ['skincare', 'oil', 'organic', 'scented', 'ayurveda'],
    inStock: true,
    bestSeller: false,
    newArrival: false
  },
  {
    id: 'art-care-chamak-chrome',
    name: 'Chamak Chrome Powder Set',
    category: 'art-care',
    categoryLabel: 'Care & Art Tools',
    price: 449,
    originalPrice: 599,
    rating: 4.8,
    reviewCount: 98,
    description: 'Transform any basic gel polish into high-shine liquid metal that rivals Indian bridal jewellery. This solid, mess-free compressed powder palette includes silver, gold, rose gold, pearl, iridescent, and holographic tones — perfect for creating mirror-finish festival nails.',
    features: [
      'Solid pressed powder format prevents airborne dust and spills',
      'Includes 6 dual-ended sponge applicators',
      'Intense mirror reflection effect when sealed with top coat',
      'Compatible with all gel brands and cure techniques'
    ],
    images: [
      'https://images.pexels.com/photos/3997349/pexels-photo-3997349.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
      'https://images.pexels.com/photos/10592995/pexels-photo-10592995.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200'
    ],
    tags: ['chrome', 'nail-art', 'shimmer', 'creative', 'bridal'],
    inStock: true,
    bestSeller: false,
    newArrival: true
  }
];

const escapeSql = (val) => {
  if (val === undefined || val === null) return 'NULL';
  if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
  if (typeof val === 'number') return val;
  if (typeof val === 'string') return "'" + val.replace(/'/g, "''") + "'";
  if (typeof val === 'object') return "'" + JSON.stringify(val).replace(/'/g, "''") + "'::jsonb";
  return 'NULL';
};

let sql = '';

for (const p of PRODUCTS) {
  sql += `
    INSERT INTO products (
      id, name, category, category_label, price, original_price, rating, review_count, 
      description, features, images, shapes, sizes, colors, tags, in_stock, best_seller, new_arrival
    ) VALUES (
      ${escapeSql(p.id)}, ${escapeSql(p.name)}, ${escapeSql(p.category)}, ${escapeSql(p.categoryLabel)}, 
      ${escapeSql(p.price)}, ${escapeSql(p.originalPrice)}, ${escapeSql(p.rating)}, ${escapeSql(p.reviewCount)}, 
      ${escapeSql(p.description)}, ${escapeSql(p.features)}, ${escapeSql(p.images)}, ${escapeSql(p.shapes)}, 
      ${escapeSql(p.sizes)}, ${escapeSql(p.colors)}, ${escapeSql(p.tags)}, ${escapeSql(p.inStock)}, 
      ${escapeSql(p.bestSeller)}, ${escapeSql(p.newArrival)}
    );
  `;
}

fs.writeFileSync('seed.sql', sql);
console.log("seed.sql generated successfully.");
