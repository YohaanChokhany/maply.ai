import { Job } from '@/types/job';
import { promises as fs } from 'fs';
import path from 'path';

function parseCSVLine(line: string): string[] {
  const result = [];
  let cell = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(cell);
      cell = '';
    } else {
      cell += char;
    }
  }
  
  result.push(cell);
  return result.map(cell => cell.trim().replace(/^"|"$/g, ''));
}

function extractCoordinates(location: string): { lat: number; lng: number } {
  const defaultCoords = { lat: 39.8283, lng: -98.5795 };
  
  try {
    const match = location.match(/\(([-\d.]+),([-\d.]+)\)/);
    if (match) {
      const lat = parseFloat(match[1]);
      const lng = parseFloat(match[2]);
      if (!isNaN(lat) && !isNaN(lng)) {
        return { lat, lng };
      }
    }
    return defaultCoords;
  } catch (error) {
    return defaultCoords;
  }
}

export async function parseJobsCSV(): Promise<Job[]> {
  try {
    const csvPath = path.join(process.cwd(), 'src/app/data/jobs.csv');
    const fileContent = await fs.readFile(csvPath, 'utf-8');
    
    const lines = fileContent.split('\n').filter(line => line.trim());
    const [header, ...rows] = lines;
    
    return rows.map((row, index) => {
      const [title, company, location, description, requirements] = parseCSVLine(row);
      return {
        id: index,
        title,
        company,
        location: location.replace(/\([-\d.,]+\)/, '').trim(),
        description,
        requirements: requirements
          .split('.')
          .map(req => req.trim())
          .filter(req => req.length > 0),
        coordinates: extractCoordinates(location)
      };
    });
  } catch (error) {
    console.error('Error parsing CSV:', error);
    return [];
  }
}