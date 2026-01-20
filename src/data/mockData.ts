// Tour Schema
export interface Tour {
  id: string;
  title: string;
  slug: string;
  location: string;
  duration: string;
  difficulty: 'Easy' | 'Moderate' | 'Challenging' | 'Extreme';
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  gallery: string[];
  shortDescription: string;
  description: string;
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  itinerary: { day: number; title: string; description: string }[];
  nextDate: string;
  spotsLeft: number;
  maxGroupSize: number;
  views: number;
  inquiries: number;
  featured: boolean;
  category: string;
}

// Sales/Booking Schema
export interface Booking {
  id: string;
  tourId: string;
  tourTitle: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  bookingDate: string;
  tripDate: string;
  participants: number;
  totalAmount: number;
  status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';
  paymentStatus: 'Pending' | 'Paid' | 'Refunded';
  createdAt: string;
}

// Analytics Data
export interface AnalyticsData {
  date: string;
  pageViews: number;
  uniqueVisitors: number;
  inquiries: number;
  bookings: number;
}

// Mock Tours
export const tours: Tour[] = [
  {
    id: '1',
    title: 'Mount Kenya Summit Expedition',
    slug: 'mount-kenya-summit',
    location: 'Mount Kenya, Kenya',
    duration: '5 Days',
    difficulty: 'Challenging',
    price: 1299,
    originalPrice: 1499,
    rating: 4.9,
    reviewCount: 127,
    image: 'https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=800&q=80',
    gallery: [],
    shortDescription: 'Conquer Africa\'s second-highest peak through pristine alpine wilderness.',
    description: 'Experience the ultimate East African adventure as you summit Point Lenana on Mount Kenya. This expedition takes you through diverse ecosystems, from bamboo forests to alpine moorlands.',
    highlights: [
      'Summit Point Lenana at 4,985m',
      'Traverse unique Afro-alpine landscapes',
      'Spot rare wildlife including rock hyrax',
      'Professional mountain guides',
      'Sunrise views over the African plains'
    ],
    inclusions: [
      'Professional mountain guide',
      'All park fees and permits',
      'Quality camping equipment',
      'All meals during the trek',
      'Airport transfers',
      'First aid kit and oxygen'
    ],
    exclusions: [
      'International flights',
      'Travel insurance',
      'Personal gear',
      'Tips and gratuities',
      'Alcoholic beverages'
    ],
    itinerary: [
      { day: 1, title: 'Arrival & Briefing', description: 'Arrive at Nairobi, transfer to Nanyuki for overnight and expedition briefing.' },
      { day: 2, title: 'Sirimon Gate to Old Moses', description: 'Begin trek through montane forest. Altitude: 3,300m.' },
      { day: 3, title: 'Old Moses to Shipton\'s Camp', description: 'Trek across moorland to Shipton\'s Camp. Altitude: 4,200m.' },
      { day: 4, title: 'Summit Day', description: 'Early morning summit push to Point Lenana, descend to Mackinder\'s Camp.' },
      { day: 5, title: 'Descent & Departure', description: 'Final descent and transfer back to Nairobi.' }
    ],
    nextDate: '2024-03-15',
    spotsLeft: 6,
    maxGroupSize: 12,
    views: 2847,
    inquiries: 89,
    featured: true,
    category: 'Mountain Expeditions'
  },
  {
    id: '2',
    title: 'Maasai Mara Walking Safari',
    slug: 'maasai-mara-walking',
    location: 'Maasai Mara, Kenya',
    duration: '4 Days',
    difficulty: 'Moderate',
    price: 899,
    rating: 4.8,
    reviewCount: 203,
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80',
    gallery: [],
    shortDescription: 'Walk alongside the Great Migration with Maasai warriors as your guides.',
    description: 'An intimate walking safari experience in the world-famous Maasai Mara. Walk with experienced Maasai guides through the savannah, tracking wildlife on foot.',
    highlights: [
      'Walk with Maasai warrior guides',
      'Close encounters with wildlife',
      'Witness the Great Migration (seasonal)',
      'Traditional Maasai village visit',
      'Luxury tented camp experience'
    ],
    inclusions: [
      'Maasai guide and armed ranger',
      'Luxury tented accommodation',
      'All meals and beverages',
      'Game drives',
      'Cultural visits',
      'Park fees'
    ],
    exclusions: [
      'Flights to Maasai Mara',
      'Travel insurance',
      'Personal items',
      'Tips'
    ],
    itinerary: [
      { day: 1, title: 'Arrival at Mara', description: 'Fly into Mara, afternoon game drive to camp.' },
      { day: 2, title: 'Walking Safari', description: 'Full day walking safari with Maasai guides.' },
      { day: 3, title: 'Migration Tracking', description: 'Early morning walk, afternoon game drive.' },
      { day: 4, title: 'Departure', description: 'Morning walk, fly back to Nairobi.' }
    ],
    nextDate: '2024-02-28',
    spotsLeft: 4,
    maxGroupSize: 8,
    views: 3421,
    inquiries: 156,
    featured: true,
    category: 'Safari Adventures'
  },
  {
    id: '3',
    title: 'Hell\'s Gate Cycling Adventure',
    slug: 'hells-gate-cycling',
    location: 'Naivasha, Kenya',
    duration: '1 Day',
    difficulty: 'Easy',
    price: 89,
    rating: 4.7,
    reviewCount: 312,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    gallery: [],
    shortDescription: 'Cycle through dramatic gorges and spot wildlife in Kenya\'s unique park.',
    description: 'Experience Hell\'s Gate National Park on two wheels. Cycle past towering cliffs, through narrow gorges, and alongside zebras and giraffes.',
    highlights: [
      'Cycle alongside wildlife',
      'Explore dramatic gorges',
      'Natural hot springs',
      'Rock climbing options',
      'Stunning photography spots'
    ],
    inclusions: [
      'Mountain bike rental',
      'Helmet and gear',
      'Park entry fees',
      'Professional guide',
      'Packed lunch',
      'Transport from Nairobi'
    ],
    exclusions: [
      'Personal items',
      'Tips',
      'Travel insurance'
    ],
    itinerary: [
      { day: 1, title: 'Full Day Adventure', description: 'Early departure from Nairobi, full day cycling and gorge exploration, return by evening.' }
    ],
    nextDate: '2024-02-10',
    spotsLeft: 15,
    maxGroupSize: 20,
    views: 5632,
    inquiries: 234,
    featured: true,
    category: 'Day Trips'
  },
  {
    id: '4',
    title: 'Kilimanjaro Lemosho Route',
    slug: 'kilimanjaro-lemosho',
    location: 'Mount Kilimanjaro, Tanzania',
    duration: '8 Days',
    difficulty: 'Extreme',
    price: 2899,
    originalPrice: 3299,
    rating: 5.0,
    reviewCount: 78,
    image: 'https://images.unsplash.com/photo-1609198092458-38a293c7ac4b?w=800&q=80',
    gallery: [],
    shortDescription: 'The most scenic route to Africa\'s highest peak with highest success rate.',
    description: 'Take on the Roof of Africa via the stunning Lemosho Route. Known for its scenic beauty and high success rate, this route offers the ultimate Kilimanjaro experience.',
    highlights: [
      'Summit Uhuru Peak at 5,895m',
      'Highest summit success rate',
      'Diverse ecological zones',
      'Stunning Shira Plateau views',
      'Smaller crowds'
    ],
    inclusions: [
      'KPAP certified guides',
      'All park fees',
      'Quality camping gear',
      'All meals on mountain',
      'Rescue fees',
      'Certificate'
    ],
    exclusions: [
      'Flights',
      'Visa fees',
      'Travel insurance',
      'Personal gear',
      'Tips'
    ],
    itinerary: [
      { day: 1, title: 'Londorossi Gate to Mti Mkubwa', description: 'Drive to gate, trek through rainforest.' },
      { day: 2, title: 'Shira 1 Camp', description: 'Ascend to Shira Plateau.' },
      { day: 3, title: 'Shira 2 Camp', description: 'Acclimatization day with optional hike.' },
      { day: 4, title: 'Barranco Camp', description: 'Trek via Lava Tower for acclimatization.' },
      { day: 5, title: 'Karanga Camp', description: 'Scale Barranco Wall, short trek.' },
      { day: 6, title: 'Barafu Camp', description: 'Rest day, prepare for summit.' },
      { day: 7, title: 'Summit Day', description: 'Midnight start, summit Uhuru Peak.' },
      { day: 8, title: 'Mweka Gate', description: 'Final descent and celebration.' }
    ],
    nextDate: '2024-04-01',
    spotsLeft: 3,
    maxGroupSize: 10,
    views: 1892,
    inquiries: 67,
    featured: false,
    category: 'Mountain Expeditions'
  },
  {
    id: '5',
    title: 'Aberdare Waterfall Trail',
    slug: 'aberdare-waterfall',
    location: 'Aberdare National Park, Kenya',
    duration: '2 Days',
    difficulty: 'Moderate',
    price: 349,
    rating: 4.6,
    reviewCount: 89,
    image: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800&q=80',
    gallery: [],
    shortDescription: 'Chase waterfalls through misty mountain forests.',
    description: 'Discover the hidden waterfalls of Aberdare National Park. Trek through bamboo forests and moorlands to find spectacular cascades.',
    highlights: [
      'Visit 5 stunning waterfalls',
      'Bamboo forest trekking',
      'Chance to spot bongo antelope',
      'Overnight at historic Treetops Lodge',
      'Night game viewing'
    ],
    inclusions: [
      'Park fees',
      'Accommodation',
      'All meals',
      'Guide fees',
      'Transport'
    ],
    exclusions: [
      'Personal items',
      'Tips',
      'Alcoholic drinks'
    ],
    itinerary: [
      { day: 1, title: 'Forest Trek', description: 'Trek to Karuru Falls and Chania Falls, overnight at Treetops.' },
      { day: 2, title: 'Moorland Exploration', description: 'Morning trek to Gura Falls, afternoon return.' }
    ],
    nextDate: '2024-02-17',
    spotsLeft: 8,
    maxGroupSize: 12,
    views: 1456,
    inquiries: 45,
    featured: false,
    category: 'Hiking Trails'
  },
  {
    id: '6',
    title: 'Lake Turkana Expedition',
    slug: 'lake-turkana-expedition',
    location: 'Northern Kenya',
    duration: '7 Days',
    difficulty: 'Challenging',
    price: 1899,
    rating: 4.9,
    reviewCount: 34,
    image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&q=80',
    gallery: [],
    shortDescription: 'Journey to the Jade Sea through Kenya\'s remote frontier.',
    description: 'An epic expedition to Lake Turkana, the world\'s largest desert lake. Experience incredible landscapes, tribal cultures, and otherworldly scenery.',
    highlights: [
      'Visit the Jade Sea',
      'Meet Turkana and El Molo tribes',
      'Explore volcanic landscapes',
      'Sleep under desert stars',
      'Off-the-beaten-path adventure'
    ],
    inclusions: [
      '4x4 vehicle with driver',
      'Camping equipment',
      'All meals',
      'Guide',
      'Community fees'
    ],
    exclusions: [
      'Flights',
      'Travel insurance',
      'Personal items',
      'Tips'
    ],
    itinerary: [
      { day: 1, title: 'Nairobi to Samburu', description: 'Drive north through changing landscapes.' },
      { day: 2, title: 'Samburu to Marsabit', description: 'Cross the Chalbi Desert.' },
      { day: 3, title: 'Marsabit Exploration', description: 'Explore crater lakes and forests.' },
      { day: 4, title: 'To Loiyangalani', description: 'Descend to Lake Turkana.' },
      { day: 5, title: 'Lake Turkana', description: 'Full day at the Jade Sea.' },
      { day: 6, title: 'South Island', description: 'Boat trip to South Island.' },
      { day: 7, title: 'Return Journey', description: 'Fly back to Nairobi.' }
    ],
    nextDate: '2024-05-10',
    spotsLeft: 5,
    maxGroupSize: 8,
    views: 2134,
    inquiries: 78,
    featured: true,
    category: 'Expedition'
  }
];

// Mock Bookings
export const bookings: Booking[] = [
  {
    id: 'B001',
    tourId: '1',
    tourTitle: 'Mount Kenya Summit Expedition',
    customerName: 'John Mwangi',
    customerEmail: 'john.mwangi@email.com',
    customerPhone: '+254 712 345 678',
    bookingDate: '2024-01-15',
    tripDate: '2024-03-15',
    participants: 2,
    totalAmount: 2598,
    status: 'Confirmed',
    paymentStatus: 'Paid',
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 'B002',
    tourId: '2',
    tourTitle: 'Maasai Mara Walking Safari',
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah.j@email.com',
    customerPhone: '+1 555 123 4567',
    bookingDate: '2024-01-18',
    tripDate: '2024-02-28',
    participants: 4,
    totalAmount: 3596,
    status: 'Confirmed',
    paymentStatus: 'Paid',
    createdAt: '2024-01-18T14:45:00Z'
  },
  {
    id: 'B003',
    tourId: '3',
    tourTitle: 'Hell\'s Gate Cycling Adventure',
    customerName: 'Michael Chen',
    customerEmail: 'mchen@email.com',
    customerPhone: '+86 138 0000 0000',
    bookingDate: '2024-01-20',
    tripDate: '2024-02-10',
    participants: 6,
    totalAmount: 534,
    status: 'Pending',
    paymentStatus: 'Pending',
    createdAt: '2024-01-20T09:15:00Z'
  },
  {
    id: 'B004',
    tourId: '4',
    tourTitle: 'Kilimanjaro Lemosho Route',
    customerName: 'Emma Wilson',
    customerEmail: 'emma.w@email.com',
    customerPhone: '+44 7700 000000',
    bookingDate: '2024-01-22',
    tripDate: '2024-04-01',
    participants: 1,
    totalAmount: 2899,
    status: 'Confirmed',
    paymentStatus: 'Paid',
    createdAt: '2024-01-22T16:20:00Z'
  },
  {
    id: 'B005',
    tourId: '6',
    tourTitle: 'Lake Turkana Expedition',
    customerName: 'David Ochieng',
    customerEmail: 'dochieng@email.com',
    customerPhone: '+254 722 000 000',
    bookingDate: '2024-01-25',
    tripDate: '2024-05-10',
    participants: 3,
    totalAmount: 5697,
    status: 'Pending',
    paymentStatus: 'Pending',
    createdAt: '2024-01-25T11:00:00Z'
  }
];

// Mock Analytics
export const analyticsData: AnalyticsData[] = [
  { date: '2024-01-01', pageViews: 1234, uniqueVisitors: 456, inquiries: 12, bookings: 3 },
  { date: '2024-01-02', pageViews: 1567, uniqueVisitors: 523, inquiries: 15, bookings: 4 },
  { date: '2024-01-03', pageViews: 1345, uniqueVisitors: 489, inquiries: 11, bookings: 2 },
  { date: '2024-01-04', pageViews: 1890, uniqueVisitors: 634, inquiries: 18, bookings: 5 },
  { date: '2024-01-05', pageViews: 2134, uniqueVisitors: 712, inquiries: 22, bookings: 6 },
  { date: '2024-01-06', pageViews: 2567, uniqueVisitors: 834, inquiries: 28, bookings: 8 },
  { date: '2024-01-07', pageViews: 2234, uniqueVisitors: 756, inquiries: 25, bookings: 7 },
  { date: '2024-01-08', pageViews: 1876, uniqueVisitors: 612, inquiries: 19, bookings: 5 },
  { date: '2024-01-09', pageViews: 1654, uniqueVisitors: 543, inquiries: 14, bookings: 4 },
  { date: '2024-01-10', pageViews: 1987, uniqueVisitors: 678, inquiries: 21, bookings: 6 },
  { date: '2024-01-11', pageViews: 2345, uniqueVisitors: 789, inquiries: 26, bookings: 7 },
  { date: '2024-01-12', pageViews: 2678, uniqueVisitors: 867, inquiries: 31, bookings: 9 },
  { date: '2024-01-13', pageViews: 2890, uniqueVisitors: 923, inquiries: 35, bookings: 10 },
  { date: '2024-01-14', pageViews: 2456, uniqueVisitors: 812, inquiries: 27, bookings: 8 },
];

// Categories for filtering
export const categories = [
  'All Adventures',
  'Mountain Expeditions',
  'Safari Adventures',
  'Day Trips',
  'Hiking Trails',
  'Expedition'
];

// Difficulty levels
export const difficultyLevels = ['Easy', 'Moderate', 'Challenging', 'Extreme'];
