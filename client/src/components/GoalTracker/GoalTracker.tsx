import styles from "./GoalTracker.module.css";
import { useState, useEffect } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { Tabs, TabPane } from "@douyinfe/semi-ui";
import { FaLaptopCode } from "react-icons/fa";
import { IoMdFitness } from "react-icons/io";
import { LuBrain } from "react-icons/lu";
import { CgProfile } from "react-icons/cg";
import { FaRegTrashAlt } from "react-icons/fa";
import GoalPane from "../GoalPane/GoalPane.tsx";

export interface Goal {
  id: string;
  title: string;
  category: "" | "Work" | "Fitness" | "Learning" | "Personal";
  progress: "not_started" | "in_progress" | "completed";
  subgoals: SubGoal[];
}

export interface SubGoal {
  id: string;
  title: string;
  done: boolean;
}

const SEED_YEAR = new Date().getFullYear();

const SEED_GOALS: Record<number, Goal[]> = {
  [SEED_YEAR]: [
    {
      id: "seed-work",
      title: "placeholder: ship a side project",
      category: "Work",
      progress: "in_progress",
      subgoals: [
        { id: "seed-work-a", title: "deploy to production", done: true },
        { id: "seed-work-b", title: "share with friends", done: false },
      ],
    },
    {
      id: "seed-learning",
      title: "placeholder: finish a system design course",
      category: "Learning",
      progress: "in_progress",
      subgoals: [
        { id: "seed-learning-a", title: "watch all lectures", done: true },
        { id: "seed-learning-b", title: "complete the capstone", done: false },
      ],
    },
  ],
};

export default function GoalTracker() {
  const [year, setYear] = useState(SEED_YEAR);

  const [allGoals, setAllGoals] = useState<Record<number, Goal[]>>(() => {
    const saved = localStorage.getItem("allGoals");
    return saved ? JSON.parse(saved) : SEED_GOALS;
  });

  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

  const [goalTitle, setGoalTitle] = useState("");
  const [goalCategory, setGoalCategory] = useState("Work");
  const [goalProgress, setGoalProgress] = useState("not_started");

  const [allSubGoals, setAllSubGoals] = useState<SubGoal[]>([]);

  const [isShaking, setIsShaking] = useState(false);

  const yearlyGoals = allGoals[year] || [];

  const yearlyWorkGoals = yearlyGoals.filter((goal) => {
    if (goal.category === "Work") {
      return true;
    }
    return false;
  });

  const yearlyFitnessGoals = yearlyGoals.filter((goal) => {
    if (goal.category === "Fitness") {
      return true;
    }
    return false;
  });

  const yearlyLearningGoals = yearlyGoals.filter((goal) => {
    if (goal.category === "Learning") {
      return true;
    }
    return false;
  });

  const yearlyPersonalGoals = yearlyGoals.filter((goal) => {
    if (goal.category === "Personal") {
      return true;
    }
    return false;
  });

  const sortedYears = Object.keys(allGoals)
    .map(Number)
    .sort((a, b) => b - a);

  const MAX_YEARS = 5;

  function handleAddYear() {
    if (sortedYears.length >= MAX_YEARS) return;
    const nextYear =
      sortedYears.length === 0 ? new Date().getFullYear() : sortedYears[0] + 1;
    if (allGoals[nextYear]) return;
    setAllGoals({ ...allGoals, [nextYear]: [] });
    setYear(nextYear);
  }

  function handleDeleteYear(yearToDelete: number) {
    if (yearToDelete === new Date().getFullYear()) return;

    const remaining = { ...allGoals };
    delete remaining[yearToDelete];
    setAllGoals(remaining);

    if (yearToDelete === year) {
      const remainingYears = Object.keys(remaining)
        .map(Number)
        .sort((a, b) => b - a);
      setYear(remainingYears[0] ?? new Date().getFullYear());
    }
  }

  function handleDelete() {
    if (selectedGoal) {
      const updatedYearlyGoals = allGoals[year].filter((goal) => {
        if (goal.id === selectedGoal.id) {
          return false;
        } else {
          return true;
        }
      });
      const updatedGoals = { ...allGoals, [year]: updatedYearlyGoals };
      setAllGoals(updatedGoals);
      closeAndResetModal();
    } else {
      return;
    }
  }

  function handleAddSubGoal() {
    const updatedSubGoals = [
      ...allSubGoals,
      {
        id: `subgoal-${Date.now()}`,
        title: "",
        done: false,
      },
    ];
    setAllSubGoals(updatedSubGoals);
  }

  function handleCheckSubgoal(goalId: string, subgoalId: string) {
    let updatedGoals = {};
    const updatedYearlyGoals = allGoals[year].map((goal) => {
      if (goal.id === goalId) {
        const updatedSubGoals = goal.subgoals.map((subgoal) => {
          if (subgoal.id === subgoalId) {
            return {
              ...subgoal,
              done: !subgoal.done,
            };
          } else {
            return subgoal;
          }
        });
        return {
          ...goal,
          subgoals: updatedSubGoals,
        };
      } else {
        return goal;
      }
    });
    updatedGoals = {
      ...allGoals,
      [year]: updatedYearlyGoals,
    };
    setAllGoals(updatedGoals);
  }

  function handleSubGoalChange(
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) {
    const updatedSubGoals = [...allSubGoals];
    updatedSubGoals[index].title = e.target.value;
    setAllSubGoals(updatedSubGoals);
  }

  function closeAndResetModal() {
    setSelectedGoal(null);
    setGoalTitle("");
    setGoalCategory("Work");
    setGoalProgress("not_started");
    setAllSubGoals([]);
    setModalOpen(false);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (goalTitle === "") {
      setIsShaking(true);
      return;
    }
    let updatedGoals = {};
    if (selectedGoal) {
      const updatedYearlyGoals = allGoals[year].map((goal) => {
        if (goal.id === selectedGoal.id) {
          return {
            ...goal,
            title: goalTitle,
            category: goalCategory as Goal["category"],
            progress: goalProgress,
            subgoals: allSubGoals,
          };
        } else {
          return goal;
        }
      });
      updatedGoals = {
        ...allGoals,
        [year]: updatedYearlyGoals,
      };
    } else {
      updatedGoals = {
        ...allGoals,
        [year]: [
          ...(allGoals[year] || []),
          {
            id: `goal-${Date.now()}`,
            title: goalTitle,
            category: goalCategory as Goal["category"],
            progress: goalProgress,
            subgoals: allSubGoals,
          },
        ],
      };
    }

    setAllGoals(updatedGoals);
    closeAndResetModal();
  }

  function handleSelectGoal(goal: Goal) {
    setSelectedGoal(goal);
    setGoalTitle(goal.title);
    setGoalCategory(goal.category);
    setGoalProgress(goal.progress);
    setAllSubGoals(goal.subgoals);
    setModalOpen(true);
  }

  useEffect(() => {
    const allGoalsParsed = JSON.stringify(allGoals);
    localStorage.setItem("allGoals", allGoalsParsed);
  }, [allGoals]);

  return (
    <>
      <div className={styles.goalContainer}>
        <div className={styles.leftSidebar}>
          {sortedYears.map((yr) => {
            const currentYear = new Date().getFullYear();
            return (
              <div key={yr} className={styles.yearRow}>
                <button
                  type="button"
                  onClick={() => {
                    setYear(yr);
                  }}
                  className={`${styles.yearList} ${yr === year ? styles.activeYear : ""}`}
                >
                  {yr}
                </button>
                {yr !== currentYear && (
                  <button
                    type="button"
                    onClick={() => {
                      handleDeleteYear(yr);
                    }}
                    className={styles.deleteYearButton}
                    aria-label={`delete ${yr}`}
                  >
                    ×
                  </button>
                )}
              </div>
            );
          })}
          {sortedYears.length < MAX_YEARS && (
            <button
              type="button"
              onClick={handleAddYear}
              className={styles.addYearButton}
              aria-label="add year"
            >
              <CiCirclePlus />
            </button>
          )}
        </div>
        <div className={styles.goalContent}>
          <Tabs
            tabPaneMotion={false}
            className={styles.tabContent}
            type="slash"
          >
            <TabPane
              className={styles.tabText}
              tab={<FaLaptopCode />}
              itemKey="1"
            >
              <GoalPane
                yearlyGoals={yearlyWorkGoals}
                onSelectGoal={handleSelectGoal}
                onToggleSubgoal={handleCheckSubgoal}
              />
            </TabPane>
            <TabPane
              className={styles.tabText}
              tab={<IoMdFitness />}
              itemKey="2"
            >
              <GoalPane
                yearlyGoals={yearlyFitnessGoals}
                onSelectGoal={handleSelectGoal}
                onToggleSubgoal={handleCheckSubgoal}
              />
            </TabPane>
            <TabPane className={styles.tabText} tab={<LuBrain />} itemKey="3">
              <GoalPane
                yearlyGoals={yearlyLearningGoals}
                onSelectGoal={handleSelectGoal}
                onToggleSubgoal={handleCheckSubgoal}
              />
            </TabPane>
            <TabPane className={styles.tabText} tab={<CgProfile />} itemKey="4">
              <GoalPane
                yearlyGoals={yearlyPersonalGoals}
                onSelectGoal={handleSelectGoal}
                onToggleSubgoal={handleCheckSubgoal}
              />
            </TabPane>
          </Tabs>
          <button
            onClick={() => {
              setModalOpen(true);
            }}
            className={styles.addGoal}
          >
            <CiCirclePlus className={styles.plusIcon} />
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div onClick={closeAndResetModal} className={styles.overlayModal}>
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            className={styles.modal}
          >
            <form onSubmit={handleSubmit} className={styles.modalForm}>
              <div className={styles.field}>
                <input
                  value={goalTitle}
                  onChange={(e) => {
                    setGoalTitle(e.target.value);
                  }}
                  className={styles.goalInput}
                  type="text"
                  placeholder="goal title"
                  autoFocus
                />
              </div>

              <div className={styles.field}>
                <span className={styles.fieldLabel}>category</span>
                <div
                  className={styles.pillGroup}
                  role="radiogroup"
                  aria-label="category"
                >
                  {(
                    [
                      { value: "Work", label: "work", icon: <FaLaptopCode /> },
                      {
                        value: "Fitness",
                        label: "fitness",
                        icon: <IoMdFitness />,
                      },
                      {
                        value: "Learning",
                        label: "learning",
                        icon: <LuBrain />,
                      },
                      {
                        value: "Personal",
                        label: "personal",
                        icon: <CgProfile />,
                      },
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      role="radio"
                      aria-checked={goalCategory === opt.value}
                      className={`${styles.pill} ${goalCategory === opt.value ? styles.pillActive : ""}`}
                      onClick={() => {
                        setGoalCategory(opt.value);
                      }}
                    >
                      {opt.icon}
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.field}>
                <span className={styles.fieldLabel}>progress</span>
                <div
                  className={styles.pillGroup}
                  role="radiogroup"
                  aria-label="progress"
                >
                  {(
                    [
                      {
                        value: "not_started",
                        label: "not started",
                        dotClass: styles.pillDotPending,
                      },
                      {
                        value: "in_progress",
                        label: "in progress",
                        dotClass: styles.pillDotOngoing,
                      },
                      {
                        value: "completed",
                        label: "completed",
                        dotClass: styles.pillDotDone,
                      },
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      role="radio"
                      aria-checked={goalProgress === opt.value}
                      className={`${styles.pill} ${goalProgress === opt.value ? styles.pillActive : ""}`}
                      onClick={() => {
                        setGoalProgress(opt.value);
                      }}
                    >
                      <span className={`${styles.pillDot} ${opt.dotClass}`} />
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.field}>
                <span className={styles.fieldLabel}>subgoals</span>
                <div className={styles.subGoalsField}>
                  {allSubGoals.map((subgoal, index) => (
                    <input
                      key={subgoal.id}
                      className={styles.subGoalInput}
                      placeholder={`subgoal ${index + 1}`}
                      value={subgoal.title}
                      onChange={(e) => {
                        handleSubGoalChange(e, index);
                      }}
                    />
                  ))}
                  <button
                    onClick={handleAddSubGoal}
                    type="button"
                    className={`${styles.addSubGoalButton} ${allSubGoals.length >= 10 ? styles.addSubGoalButtonDisabled : ""}`}
                    disabled={allSubGoals.length >= 10}
                  >
                    + add subgoal
                  </button>
                </div>
              </div>

              <div className={styles.modalButtons}>
                {selectedGoal && (
                  <button
                    onClick={handleDelete}
                    className={styles.deleteButton}
                    type="button"
                  >
                    <FaRegTrashAlt />
                    <span>delete</span>
                  </button>
                )}
                <div className={styles.modalButtonsRight}>
                  <button
                    className={styles.secondaryButton}
                    type="button"
                    onClick={closeAndResetModal}
                  >
                    cancel
                  </button>
                  <button
                    className={`${styles.primaryButton} ${isShaking ? styles.shake : ""}`}
                    onAnimationEnd={() => {
                      setIsShaking(false);
                    }}
                    type="submit"
                  >
                    {selectedGoal !== null ? "update" : "add goal"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
