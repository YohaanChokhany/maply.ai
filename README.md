# Job Board with Interactive Map

An interactive job board application built with Next.js, TypeScript, and Google Maps API that allows users to search and filter jobs while visualizing their locations on a map.

## Features

-   Interactive map interface with clustered job markers
-   Real-time job search and filtering
-   Save favorite jobs with local storage persistence
-   Location-based job grouping
-   Responsive layout with split view
-   Job selection and detailed view navigation

## Getting Started

### Prerequisites

-   Node.js (v14 or higher)
-   npm or yarn
-   Google Maps API key

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd maply.ai
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

4. Start the development server:

```bash
npm run dev
```

## Project Structure

```
src/
├── app/
│   ├── page.tsx            # Main job board page
│   └── jobs/
│       └── [id]/
│           └── page.tsx    # Job details page
├── components/
│   ├── JobMap.tsx         # Google Maps component
│   ├── SearchBar.tsx      # Search input component
│   └── GoogleMapsWrapper.tsx # Maps API loader wrapper
├── types/
│   └── job.ts            # TypeScript interfaces
└── utils/
    └── groupByLocation.ts # Job grouping utilities
```

## Technologies Used

-   **Framework**: Next.js 14
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS
-   **Maps**: Google Maps JavaScript API
-   **State Management**: React Hooks
-   **Data Persistence**: Local Storage

## Features in Detail

### Map Integration

-   Clustered markers for multiple jobs in the same location
-   Custom marker styling for active/inactive states
-   Automatic bounds adjustment based on visible jobs

### Job Management

-   Real-time search across job title, company, and location
-   Toggle between all jobs and saved jobs
-   Persistent job saving using local storage
-   Location-based job grouping

### User Interface

-   Split view with job list and map
-   Interactive job cards with save functionality
-   Location-based filtering when selecting map markers
-   Responsive design for various screen sizes
