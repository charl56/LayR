import type { DTOInfo } from "./DTOInfo";


export interface Info extends DTOInfo  {
  id: string;
  name: string;
}

export interface Project {
  name: string;
  img: string;
}
export interface Artist extends DTOInfo, Info  {
  projets: Project[];
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


