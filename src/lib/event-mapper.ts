export type EventType =
    | 'EXAM'
    | 'DEADLINE'
    | 'ACADEMIC'
    | 'HOLIDAY'
    | 'GATE'
    | 'EVENT';

export interface AcademicEvent {
    id: string;
    title: string;
    start: string; // YYYY-MM-DD
    end: string;   // YYYY-MM-DD
    type: EventType;
    description?: string;
    isUserEvent?: boolean;
}

export const semesterEvents: AcademicEvent[] = [
    { id: 'teach-start', title: 'Teaching Start', start: '2025-11-24', end: '2025-11-24', type: 'ACADEMIC' },
    { id: 'wt-1', title: 'Weekly Test 1', start: '2025-11-29', end: '2025-11-29', type: 'DEADLINE' },
    { id: 'wt-2', title: 'Weekly Test 2', start: '2025-12-06', end: '2025-12-06', type: 'DEADLINE' },
    { id: 'wt-3', title: 'Weekly Test 3', start: '2025-12-10', end: '2025-12-10', type: 'DEADLINE' },
    { id: 'wt-4', title: 'Weekly Test 4', start: '2025-12-17', end: '2025-12-17', type: 'DEADLINE' },
    { id: 'wt-5', title: 'Weekly Test 5', start: '2025-12-24', end: '2025-12-24', type: 'DEADLINE' },
    { id: 'wt-6', title: 'Weekly Test 6', start: '2025-12-31', end: '2025-12-31', type: 'DEADLINE' },
    { id: 'h-xmas', title: 'Christmas', start: '2025-12-25', end: '2025-12-25', type: 'HOLIDAY' },
    { id: 'h-makar', title: 'Makar Sankranti', start: '2026-01-14', end: '2026-01-14', type: 'HOLIDAY' },
    { id: 'h-sakranti-2', title: 'Sakranti (2nd Day)', start: '2026-01-15', end: '2026-01-15', type: 'HOLIDAY' },
    { id: 'h-link', title: 'Link Holiday', start: '2026-01-16', end: '2026-01-16', type: 'HOLIDAY' },
    { id: 'h-republic', title: 'Republic Day', start: '2026-01-26', end: '2026-01-26', type: 'HOLIDAY' },
    { id: 'tech-expo', title: 'Tech Expo', start: '2026-02-03', end: '2026-02-04', type: 'ACADEMIC' },
    { id: 'mid-sem', title: 'Mid Sem Exam', start: '2026-02-10', end: '2026-02-15', type: 'EXAM' },
    { id: 'gate-1', title: 'GATE Day 1/2', start: '2026-02-08', end: '2026-02-09', type: 'EXAM' },
    { id: 'gate-2', title: 'GATE Day 3', start: '2026-02-15', end: '2026-02-15', type: 'EXAM' },
    { id: 'tw-sub', title: 'TW Submission', start: '2026-03-16', end: '2026-03-21', type: 'DEADLINE' },
    { id: 'teach-end', title: 'Teaching End', start: '2026-03-28', end: '2026-03-28', type: 'ACADEMIC' },
    { id: 'ese-prac', title: 'ESE Practical', start: '2026-03-30', end: '2026-04-11', type: 'EXAM' },
    { id: 'ese-theory', title: 'ESE Theory', start: '2026-04-13', end: '2026-04-25', type: 'EXAM' },
];
