import type { DTOInfo } from "./DTOInfo";

export interface Artist extends DTOInfo  {
  id: String;
  name: String;
  images: String[];
  spotify: String;
  soundcloud: String;
}

export interface ScannedPhoto {
  id: String;
  projectName: String;
  src: String | null;
  timestamp: number;
}

export type Page = 'home' | 'collection' | 'scanner';


