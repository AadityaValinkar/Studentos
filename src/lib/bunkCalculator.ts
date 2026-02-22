export interface BunkResult {
    currentPercentage: number;
    classesToAttend: number;
    classesCanBunk: number;
    status: "Safe" | "Warning" | "Critical";
}

export function calculateBunkStats(
    totalClasses: number,
    attendedClasses: number,
    targetPercentage: number = 75
): BunkResult {
    if (totalClasses === 0) {
        return {
            currentPercentage: 0,
            classesToAttend: 0,
            classesCanBunk: 0,
            status: "Safe",
        };
    }

    const currentPercentage = (attendedClasses / totalClasses) * 100;

    // Calculate how many more classes to attend to reach target
    let classesToAttend = 0;
    if (currentPercentage < targetPercentage) {
        // (attended + x) / (total + x) >= target/100
        // attended + x >= (target/100) * total + (target/100) * x
        // x * (1 - target/100) >= (target/100) * total - attended
        // x >= ((target/100) * total - attended) / (1 - target/100)

        const targetFraction = targetPercentage / 100;
        const required = (targetFraction * totalClasses - attendedClasses) / (1 - targetFraction);
        // ensure required is at least 0
        classesToAttend = Math.max(0, Math.ceil(required));
    }

    // Calculate how many classes can be bunked while staying >= target
    let classesCanBunk = 0;
    if (currentPercentage >= targetPercentage) {
        // attended / (total + x) >= target/100
        // attended >= (target/100) * total + (target/100) * x
        // attended - (target/100) * total >= (target/100) * x
        // x <= (attended - (target/100) * total) / (target/100)

        const targetFraction = targetPercentage / 100;
        const allowed = (attendedClasses - targetFraction * totalClasses) / targetFraction;
        classesCanBunk = Math.max(0, Math.floor(allowed));
    }

    let status: BunkResult["status"] = "Safe";
    if (currentPercentage < targetPercentage) {
        status = "Critical";
    } else if (currentPercentage < targetPercentage + 5) {
        status = "Warning";
    }

    return {
        currentPercentage: Number(currentPercentage.toFixed(2)),
        classesToAttend,
        classesCanBunk,
        status,
    };
}
