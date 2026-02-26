import { differenceInCalendarDays } from "date-fns";

export interface AcademicProfile {
    cgpa: number;
    attendance: number;
    target_cgpa: number;
    semester_end_date: string;
}

export interface AcademicTarget {
    type: "cgpa" | "placement" | "internship" | "skill";
    target_value?: number;
    deadline?: string;
}

/**
 * Calculates the Academic Momentum score (0-100)
 * Weighted: 40% CGPA progress, 30% Attendance, 30% Target proximity
 */
export function calculateMomentum(profile: AcademicProfile, targets: AcademicTarget[]): number {
    if (!profile) return 0;

    // CGPA Component (max 40 points)
    // If current >= target, full 40. Else proportional.
    const cgpaScore = profile.cgpa >= profile.target_cgpa
        ? 40
        : (profile.cgpa / profile.target_cgpa) * 40;

    // Attendance Component (max 30 points)
    // Benchmark is 75%. If >= 75%, 20-30 points.
    const attendanceScore = (profile.attendance / 100) * 30;

    // Target Component (max 30 points)
    // Based on number of targets and their deadlines (placeholder logic for now)
    const targetScore = targets.length > 0 ? Math.min(targets.length * 10, 30) : 10;

    const total = Math.round(cgpaScore + attendanceScore + targetScore);
    return Math.min(total, 100);
}

/**
 * Returns a friendly descriptive status for the momentum score
 */
export function getMomentumStatus(score: number): string {
    if (score >= 85) return "Your academic momentum is exceptional.";
    if (score >= 70) return "You're making great progress.";
    if (score >= 50) return "Your momentum is stable.";
    return "Time to ramp up the focus.";
}

/**
 * Calculates days remaining to semester end or specific deadline
 */
export function getDaysRemaining(dateString: string): number {
    if (!dateString) return 0;
    const date = new Date(dateString);
    const today = new Date();
    return Math.max(differenceInCalendarDays(date, today), 0);
}
