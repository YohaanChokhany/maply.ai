import { Job } from '@/types/job';

export interface GroupedJobs {
  coordinates: {
    lat: number;
    lng: number;
  };
  jobs: Job[];
}

export function groupJobsByLocation(jobs: Job[]): GroupedJobs[] {
  const grouped = jobs.reduce((acc, job) => {
    const key = `${job.coordinates.lat},${job.coordinates.lng}`;
    if (!acc[key]) {
      acc[key] = {
        coordinates: job.coordinates,
        jobs: []
      };
    }
    acc[key].jobs.push(job);
    return acc;
  }, {} as Record<string, GroupedJobs>);

  return Object.values(grouped);
}