import styles from "./GoalPane.module.css";
import type { Goal } from "../GoalTracker/GoalTracker.tsx";

interface GoalPaneProps {
  yearlyGoals: Goal[];
  onSelectGoal: (goal: Goal) => void;
  onToggleSubgoal: (goalId: string, subgoalId: string) => void;
}

export default function GoalPane({
  yearlyGoals,
  onSelectGoal,
  onToggleSubgoal,
}: GoalPaneProps) {
  return (
    <>
      {yearlyGoals.length > 0 ? (
        <>
          <ol className={styles.goalList}>
            {yearlyGoals.map((goal, index) => {
              return (
                <li
                  className={`${goal.progress === "not_started" ? styles.goalNotStarted : goal.progress === "in_progress" ? styles.goalInProgress : styles.goalCompleted}`}
                  onClick={() => {
                    onSelectGoal(goal);
                  }}
                  key={goal.id}
                >
                  <div className={styles.goalRows}>
                    <div className={styles.goalLeft}>
                      <span className={styles.goalNumber}>{index + 1}.</span>
                      <span>{goal.title}</span>
                    </div>
                    <span
                      className={`${styles.statusDot} ${goal.progress === "not_started" ? styles.notStarted : goal.progress === "in_progress" ? styles.inProgress : styles.completed}`}
                    />
                  </div>
                  <div className={styles.subgoalList}>
                    {goal.subgoals.map((subgoal, indexTwo) => {
                      return (
                        <div key={subgoal.id} className={styles.subgoalRow}>
                          <div className={styles.subgoalLeft}>
                            <span className={styles.subgoalLetter}>
                              {String.fromCharCode(97 + indexTwo)}
                              {")"}
                            </span>
                            <span
                              className={
                                subgoal.done
                                  ? styles.completedSubgoal
                                  : styles.unfinishedSubgoal
                              }
                            >
                              {subgoal.title}
                            </span>
                          </div>
                          <input
                            className={styles.checkboxTodo}
                            type="checkbox"
                            checked={subgoal.done}
                            onChange={() => {
                              onToggleSubgoal(goal.id, subgoal.id);
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>
                </li>
              );
            })}
          </ol>
        </>
      ) : (
        <div className={styles.noGoalsAdded}>No goals added yet.</div>
      )}
    </>
  );
}
