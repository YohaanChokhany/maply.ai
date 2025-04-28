'use client';

import { memo } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { GroupedJobs, groupJobsByLocation } from '@/utils/groupByLocation';
import { Job } from '@/types/job';

const mapContainerStyle = {
  width: '100%',
  height: '100%'
};

const center = {
  lat: 39.8283,
  lng: -98.5795
};

interface JobMapProps {
  filteredJobs: Job[];
  selectedJob: Job | null;
  selectedGroup: GroupedJobs | null;
  onGroupSelect: (group: GroupedJobs) => void;
  onMapLoad: (map: google.maps.Map) => void;
}

function JobMap({ 
  filteredJobs, 
  selectedJob, 
  selectedGroup, 
  onGroupSelect,
  onMapLoad 
}: JobMapProps) {
  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={4}
      onLoad={onMapLoad}
      options={{
        maxZoom: 12,
        minZoom: 3,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
      }}
    >
      {groupJobsByLocation(filteredJobs).map((group) => (
        <Marker
          key={`${group.coordinates.lat}-${group.coordinates.lng}`}
          position={group.coordinates}
          onClick={() => onGroupSelect(group)}
          icon={{
            url: group.jobs.some(job => job.id === selectedJob?.id) || 
                (selectedGroup && group.coordinates.lat === selectedGroup.coordinates.lat && 
                group.coordinates.lng === selectedGroup.coordinates.lng)
              ? '/icons/marker-active.svg'
              : '/icons/marker.svg',
            scaledSize: new google.maps.Size(30, 30),
            anchor: new google.maps.Point(15, 30)
          }}
        />
      ))}
    </GoogleMap>
  );
}

export default memo(JobMap);