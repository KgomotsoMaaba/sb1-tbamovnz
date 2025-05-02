export interface DirectoryItem {
  id: string;
  name: string;
  category: string;
  description: string;
  location: string;
  website?: string;
  contact?: string;
  rating?: number;
}

// Mock directory data
const directoryItems: DirectoryItem[] = [
  {
    id: '1',
    name: 'Cape Point Adventures',
    category: 'adventure',
    description: 'Experience thrilling hiking, wildlife viewing, and coastal exploration at the iconic Cape Point. Guided tours available for all skill levels.',
    location: 'Cape Town, Western Cape',
    website: 'https://example.com/cape-point',
    rating: 4.8
  },
  {
    id: '2',
    name: 'Kruger Safari Lodge',
    category: 'accommodation',
    description: 'Luxury lodge offering unforgettable safari experiences in the heart of Kruger National Park. See the Big Five in their natural habitat.',
    location: 'Kruger National Park, Mpumalanga',
    website: 'https://example.com/kruger-lodge',
    rating: 4.9
  },
  {
    id: '3',
    name: 'Drakensberg Mountain Retreat',
    category: 'accommodation',
    description: 'Peaceful mountain getaway with stunning views of the Drakensberg range. Perfect for hiking, photography, and relaxation.',
    location: 'Central Drakensberg, KwaZulu-Natal',
    website: 'https://example.com/drakensberg',
    rating: 4.7
  },
  {
    id: '4',
    name: 'Stellenbosch Wine Tours',
    category: 'adventure',
    description: 'Explore South Africa\'s premier wine region with guided tours of historic vineyards and wine tastings at award-winning estates.',
    location: 'Stellenbosch, Western Cape',
    website: 'https://example.com/wine-tours',
    rating: 4.6
  },
  {
    id: '5',
    name: 'The Lighthouse Restaurant',
    category: 'dining',
    description: 'Seafood restaurant overlooking the Atlantic Ocean. Enjoy fresh catch of the day while watching spectacular sunsets.',
    location: 'Sea Point, Cape Town',
    website: 'https://example.com/lighthouse',
    rating: 4.5
  },
  {
    id: '6',
    name: 'Addo Elephant Safari',
    category: 'adventure',
    description: 'Get up close with elephants and other wildlife in Addo Elephant National Park. Day and overnight safari packages available.',
    location: 'Addo, Eastern Cape',
    website: 'https://example.com/addo-safari',
    rating: 4.9
  },
  {
    id: '7',
    name: 'Tranquil Waters Spa',
    category: 'wellness',
    description: 'Luxurious day spa offering a range of treatments including hot stone therapy, aromatherapy massages, and rejuvenating facials.',
    location: 'Sandton, Johannesburg',
    website: 'https://example.com/tranquil-spa',
    rating: 4.7
  },
  {
    id: '8',
    name: 'Garden Route Cottages',
    category: 'accommodation',
    description: 'Charming cottages located along South Africa\'s scenic Garden Route. Perfect base for exploring beaches, forests, and lagoons.',
    location: 'Knysna, Western Cape',
    website: 'https://example.com/garden-route',
    rating: 4.6
  },
  {
    id: '9',
    name: 'Soweto Bicycle Tours',
    category: 'adventure',
    description: 'Experience the vibrant culture and history of Soweto on a guided bicycle tour. Visit significant historical sites and meet local residents.',
    location: 'Soweto, Johannesburg',
    website: 'https://example.com/soweto-bikes',
    rating: 4.8
  },
  {
    id: '10',
    name: 'African Fusion Restaurant',
    category: 'dining',
    description: 'Modern restaurant offering innovative fusion cuisine that combines traditional African flavors with international cooking techniques.',
    location: 'Camps Bay, Cape Town',
    website: 'https://example.com/african-fusion',
    rating: 4.4
  }
];

export const getDirectoryItems = (): DirectoryItem[] => {
  return directoryItems;
};