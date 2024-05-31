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