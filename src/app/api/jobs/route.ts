import { parseJobsCSV } from '@/utils/csvParser';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const jobs = await parseJobsCSV();
    return NextResponse.json(jobs);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}