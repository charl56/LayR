import type { DTOInfo } from "./DTOInfo";

export interface Artist extends DTOInfo  {
  id: string;
  name: string;
  images: string[];
  spotify: string;
  soundcloud: string;
}

export interface ScannedPhoto {
  id: string;
  projectName: string;
  src: string;
  timestamp: number;
}

export type Page = 'home' | 'collection' | 'scanner';


