// function to check if a date string is past the current date

function isPastDue(dueDate) {
    return new Date(dueDate) < new Date();
}

// Helper function to calculate the weighted average score for a learner
function calculateWeightedAverage(assignments, submissions) {
    let totalPoints = 0;
    let earnedPoints = 0;

    for (const assignment of assignments) {
        const submission = submissions.find(
            (s) => s.assignment_id === assignment.id
        );

        if (submission) {
            const lateDeduction = isPastDue(assignment.due_at) ? 0.1 : 0;
            const scorePercentage =
                (submission.submission.score / assignment.points_possible) *
                (1 - lateDeduction);
            earnedPoints += scorePercentage * assignment.points_possible;
        }

        totalPoints += assignment.points_possible;
    }

    return totalPoints === 0 ? 0 : earnedPoints / totalPoints;
}

// Main function to get learner data

function getLearnerData(
    courseInfo,
    assignmentGroup,
    learnerSubmissions
) {
    // Validate input data
    if (assignmentGroup.course_id !== courseInfo.id) {
        throw new Error("Invalid input: Assignment group does not belong to the course");
    }

    const learnerData = [];

    for (const submission of learnerSubmissions) {
        const learnerScores = {};
        let totalWeightedAverage = 0;

        for (const assignment of assignmentGroup.assignments) {
            if (!isPastDue(assignment.due_at)) {
                const submissionData = submission.submission;
                const scorePercentage =
                    submissionData.score / assignment.points_possible;
                const lateDeduction = isPastDue(assignment.due_at) ? 0.1 : 0;
                learnerScores[assignment.id] = scorePercentage * (1 - lateDeduction);
                totalWeightedAverage +=
                    scorePercentage * (1 - lateDeduction) * assignment.points_possible;
            }
        }

        const totalPoints = assignmentGroup.assignments.reduce(
            (sum, assignment) => sum + assignment.points_possible,
            0
        );

        learnerData.push({
            id: submission.learner_id,
            avg: totalPoints === 0 ? 0 : totalWeightedAverage / totalPoints,
            ...learnerScores,
        });
    }

    return learnerData;
}