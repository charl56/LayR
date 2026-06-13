import type { DTOInfo } from "./DTOInfo";


export interface Info extends DTOInfo  {
  id: string;
  name: string;
  links?: Links;
}

export interface Project {
  name: string;
  img: string;
  video?: string;
  videoId?: string;
}
export interface Artist extends DTOInfo, Info  {
  projets: Project[];
  links?: Links;

}

export interface ScannedPhoto {
  id: string;
  projectName: string;
  src: string;
  timestamp: number;
}

export interface Links {
  apple?: string;
  spotify?: string;
  deezer?: string;
  soundcloud?: string;
}

export type Page = 'home' | 'collection' | 'scanner';


