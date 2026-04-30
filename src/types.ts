export type PropertyType = 'Home' | 'Shop' | 'Apartment';
export type StoryType = 'Single' | 'Double';

export interface Property {
  id: string;
  title: string;
  type: PropertyType;
  stories: StoryType;
  rooms: string;
  bathrooms: string;
  country: string;
  city: string;
  area: string;
  address: string;
  hasGas: boolean;
  hasElectricity: boolean;
  phone: string;
  whatsapp: string;
  currency: string;
  language: string;
  price: string;
  imageUrls: string[];
  isAvailable: boolean;
  createdAt: number;
  ownerEmail: string; // To simulate "my properties"
  ownerUid: string;
  likes?: string[];
  views?: number;
}

export interface User {
  email: string;
  name: string;
}
