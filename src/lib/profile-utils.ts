export interface ProfileData {
    full_name?: string;
    branch?: string;
    semester?: number;
    cgpa?: number;
    attendance?: number;
    career_goal?: string;
    skills?: string[];
}

export const COMPLETENESS_FIELDS: (keyof ProfileData)[] = [
    'full_name',
    'branch',
    'semester',
    'cgpa',
    'attendance',
    'career_goal',
    'skills'
];

/**
 * Calculates the percentage of profile completion based on weighted fields.
 */
export function calculateCompleteness(profile: ProfileData): number {
    if (!profile) return 0;

    let filledCount = 0;

    COMPLETENESS_FIELDS.forEach(field => {
        const value = profile[field];
        if (Array.isArray(value)) {
            if (value.length > 0) filledCount++;
        } else if (value !== null && value !== undefined && value !== '') {
            filledCount++;
        }
    });

    return Math.round((filledCount / COMPLETENESS_FIELDS.length) * 100);
}

/**
 * Returns whether the profile is considered "completed" (>= 70%)
 */
export function isProfileComplete(percentage: number): boolean {
    return percentage >= 70;
}
