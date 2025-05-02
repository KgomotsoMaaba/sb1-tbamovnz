export interface SchoolTerm {
  name: string;
  startDate: string;
  endDate: string;
}

// South African school terms for 2025 (approximate dates based on typical patterns)
const schoolTerms2025: SchoolTerm[] = [
  {
    name: 'Term 1',
    startDate: '2025-01-15',
    endDate: '2025-03-28',
  },
  {
    name: 'Term 2',
    startDate: '2025-04-14',
    endDate: '2025-06-27',
  },
  {
    name: 'Term 3',
    startDate: '2025-07-21',
    endDate: '2025-09-26',
  },
  {
    name: 'Term 4',
    startDate: '2025-10-06',
    endDate: '2025-12-05',
  }
];

// Function to get school terms for a specific year
export const getSchoolTerms = (year: number): SchoolTerm[] => {
  // For now, we only have data for 2025, so we'll return that regardless of the year parameter
  // In a real application, you would have data for multiple years or fetch from an API
  return schoolTerms2025;
};