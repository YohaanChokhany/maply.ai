export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
}