import { parseJobsCSV } from '@/utils/csvParser';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function JobPage({ params }: { params: { id: string } }) {
  const jobs = await parseJobsCSV();
  const job = jobs[parseInt(params.id)];

  if (!job) {
    notFound();
  }

  return (
    <div className="min-h-screen p-8">
      <Link 
        href="/"
        className="inline-flex items-center text-blue-500 hover:text-blue-600 mb-8"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Jobs
      </Link>

      <main className="max-w-2xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
          <div className="text-gray-600">
            <p className="text-xl mb-1">{job.company}</p>
            <p className="text-gray-500">{job.location}</p>
          </div>
        </header>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Description</h2>
          <p className="text-gray-700 leading-relaxed">{job.description}</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Requirements</h2>
          <ul className="list-disc pl-5 space-y-2">
            {job.requirements.map((req, index) => (
              <li key={index} className="text-gray-700">{req}</li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}