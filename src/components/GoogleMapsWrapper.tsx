'use client';

import { useLoadScript } from '@react-google-maps/api';
import { PropsWithChildren } from 'react';

const libraries: ("places" | "drawing" | "geometry" | "visualization")[] = ['places'];

export default function GoogleMapsWrapper({ children }: PropsWithChildren) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries,
  });

  if (!isLoaded) return <div>Loading...</div>;
  return <>{children}</>;
}