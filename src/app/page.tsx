'use client';

import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import SearchBar from '@/components/SearchBar';
import JobMap from '@/components/JobMap';
import GoogleMapsWrapper from '@/components/GoogleMapsWrapper';
import { Job } from '@/types/job';
import { groupJobsByLocation, GroupedJobs } from '@/utils/groupByLocation';

const mapContainerStyle = {
  width: '100%',
  height: '100%'
};

const center = {
  lat: 39.8283,
  lng: -98.5795
};

const libraries: ("places" | "drawing" | "geometry" | "visualization")[] = ['places'];

export default function Home() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [savedJobIds, setSavedJobIds] = useState<number[]>([]);
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<GroupedJobs | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('/api/jobs');
        const jobsData = await response.json();
        setJobs(jobsData);
        setFilteredJobs(jobsData);
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
      }
    };
    fetchJobs();

    const savedJobs = localStorage.getItem('savedJobs');
    if (savedJobs) {
      setSavedJobIds(JSON.parse(savedJobs));
    }
  }, []);

  const handleSearch = (query: string) => {
    const searchTerm = query.toLowerCase();
    let filtered = jobs.filter((job) => 
      job.title.toLowerCase().includes(searchTerm) ||
      job.company.toLowerCase().includes(searchTerm) ||
      job.location.toLowerCase().includes(searchTerm)
    );
    
    if (showSavedOnly) {
      filtered = filtered.filter((job) => savedJobIds.includes(job.id));
    }
    
    setFilteredJobs(filtered);
  };

  useEffect(() => {
    handleSearch('');
  }, [showSavedOnly]);

  const toggleSaveJob = (jobId: number, event: React.MouseEvent) => {
    event.preventDefault();
    const newSavedJobIds = savedJobIds.includes(jobId)
      ? savedJobIds.filter(id => id !== jobId)
      : [...savedJobIds, jobId];
    
    setSavedJobIds(newSavedJobIds);
    localStorage.setItem('savedJobs', JSON.stringify(newSavedJobIds));
  };

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const fitBounds = useCallback(() => {
    if (map && filteredJobs.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      filteredJobs.forEach(job => {
        bounds.extend(job.coordinates);
      });
      map.fitBounds(bounds);
    }
  }, [map, filteredJobs]);

  useEffect(() => {
    fitBounds();
  }, [filteredJobs, fitBounds]);

  const getVisibleJobs = useCallback(() => {
    if (selectedGroup) {
      const locationJobs = filteredJobs.filter(job => 
        job.coordinates.lat === selectedGroup.coordinates.lat && 
        job.coordinates.lng === selectedGroup.coordinates.lng
      );
      return locationJobs;
    } else if (selectedJob) {
      const group = groupJobsByLocation(filteredJobs).find(group =>
        group.jobs.some(job => job.id === selectedJob.id)
      );
      return group ? group.jobs : [selectedJob];
    }
    return filteredJobs;
  }, [selectedGroup, selectedJob, filteredJobs]);

  const clearSelection = () => {
    setSelectedJob(null);
    setSelectedGroup(null);
  };

  const handleJobClick = (job: Job) => {
    setSelectedJob(job);
    router.push(`/jobs/${job.id}`);
  };

  const handleGroupSelect = useCallback((group: GroupedJobs) => {
    setSelectedGroup(group);
    setSelectedJob(null);
  }, []);

  return (
    <div className="min-h-screen h-screen flex flex-col">
      <header className="p-4 border-b">
        <h1 className="text-3xl font-bold mb-4">Job Board</h1>
        <div className="flex gap-4 items-center">
          <SearchBar onSearch={handleSearch} />
          <button
            onClick={() => setShowSavedOnly(!showSavedOnly)}
            className={`whitespace-nowrap px-4 py-2 rounded-lg border transition-colors ${
              showSavedOnly 
                ? 'bg-blue-500 text-white border-blue-500' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            {showSavedOnly ? 'Show All Jobs' : 'Show Saved Jobs'}
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Job List */}
        <div className="w-1/3 overflow-y-auto border-r p-4">
          <div className="text-sm text-gray-600 mb-4">
            Showing {getVisibleJobs().length} {getVisibleJobs().length === 1 ? 'job' : 'jobs'}
            {selectedGroup && ' in this location'}
            {showSavedOnly && ' (saved)'}
          </div>

          {selectedGroup || selectedJob ? (
            <button
              onClick={clearSelection}
              className="mb-4 text-blue-500 hover:text-blue-600 flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to all jobs
            </button>
          ) : null}
          
          {getVisibleJobs().map((job) => (
            <div 
              key={job.id}
              className={`relative p-4 mb-4 rounded-lg border cursor-pointer transition-colors ${
                selectedJob?.id === job.id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'hover:border-gray-400'
              }`}
              onClick={() => handleJobClick(job)}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSaveJob(job.id, e);
                }}
                className="absolute top-4 right-4 text-gray-500 hover:text-blue-500"
                aria-label={savedJobIds.includes(job.id) ? "Unsave job" : "Save job"}
              >
                <svg
                  className="w-6 h-6"
                  fill={savedJobIds.includes(job.id) ? "currentColor" : "none"}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  />
                </svg>
              </button>
              <h2 className="text-xl font-semibold">{job.title}</h2>
              <p className="text-gray-600">{job.company}</p>
              <p className="text-gray-500">{job.location}</p>
            </div>
          ))}
        </div>

        {/* Map */}
        <div className="w-2/3 relative">
          <GoogleMapsWrapper>
            <JobMap
              filteredJobs={filteredJobs}
              selectedJob={selectedJob}
              selectedGroup={selectedGroup}
              onGroupSelect={handleGroupSelect}
              onMapLoad={onLoad}
            />
          </GoogleMapsWrapper>
        </div>
      </div>
    </div>
  );
}
