import styles from "./GoalTracker.module.css";
import { useState, useEffect } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { Tabs, TabPane } from "@douyinfe/semi-ui";
import { FaLaptopCode } from "react-icons/fa";
import { IoMdFitness } from "react-icons/io";
import { LuBrain } from "react-icons/lu";
import { CgProfile } from "react-icons/cg";
import { FaRegTrashAlt } from "react-icons/fa";

export interface Goal {
  id: string;
  title: string;
  category: "" | "Work" | "Fitness" | "Learning" | "Personal";
  progress: "not_started" | "in_progress" | "completed";
}

export default function GoalTracker() {
  const currentMonth = new Date().getMonth();
  const [year, setYear] = useState(() => {
    return new Date().getFullYear();
  });

  const [allGoals, setAllGoals] = useState<Record<number, Goal[]>>(() => {
    const saved = localStorage.getItem("allGoals");
    return saved ? JSON.parse(saved) : {};
  });

  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

  const [goalTitle, setGoalTitle] = useState("");
  const [goalCategory, setGoalCategory] = useState("Work");

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

  function handleClick() {
    const currentYear = new Date().getFullYear();
    const updatedGoals = {
      ...allGoals,
      [currentYear]: allGoals[currentYear] || [],
    };
    setAllGoals(updatedGoals);
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

  function closeAndResetModal() {
    setSelectedGoal(null);
    setGoalTitle("");
    setGoalCategory("Work");
    setModalOpen(false);
  }

  function handleSubmit(e) {
    e.preventDefault();
    let updatedGoals = {};
    if (selectedGoal) {
      const updatedYearlyGoals = allGoals[year].map((goal) => {
        if (goal.id === selectedGoal.id) {
          return {
            ...goal,
            title: goalTitle,
            category: goalCategory as Goal["category"],
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
            progress: "not_started",
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
          {Object.keys(allGoals).map((yearKey) => {
            return (
              <span
                onClick={() => {
                  setYear(Number(yearKey));
                }}
                className={`${styles.yearList} ${Number(yearKey) === year ? styles.activeYear : ""}`}
                key={yearKey}
              >
                {yearKey}
              </span>
            );
          })}
          {currentMonth === 11 && (
            <button onClick={handleClick}>
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
              <ol className={styles.goalList}>
                {yearlyWorkGoals.map((goal) => {
                  return (
                    <li
                      onClick={() => {
                        handleSelectGoal(goal);
                      }}
                      key={goal.id}
                    >
                      {goal.title}
                    </li>
                  );
                })}
              </ol>
            </TabPane>
            <TabPane
              className={styles.tabText}
              tab={<IoMdFitness />}
              itemKey="2"
            >
              <ol className={styles.goalList}>
                {yearlyFitnessGoals.map((goal) => {
                  return (
                    <li
                      onClick={() => {
                        handleSelectGoal(goal);
                      }}
                      key={goal.id}
                    >
                      {goal.title}
                    </li>
                  );
                })}
              </ol>
            </TabPane>
            <TabPane className={styles.tabText} tab={<LuBrain />} itemKey="3">
              <ol className={styles.goalList}>
                {yearlyLearningGoals.map((goal) => {
                  return (
                    <li
                      onClick={() => {
                        handleSelectGoal(goal);
                      }}
                      key={goal.id}
                    >
                      {goal.title}
                    </li>
                  );
                })}
              </ol>
            </TabPane>
            <TabPane className={styles.tabText} tab={<CgProfile />} itemKey="4">
              <ol className={styles.goalList}>
                {yearlyPersonalGoals.map((goal) => {
                  return (
                    <li
                      onClick={() => {
                        handleSelectGoal(goal);
                      }}
                      key={goal.id}
                    >
                      {goal.title}
                    </li>
                  );
                })}
              </ol>
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
              <input
                value={goalTitle}
                onChange={(e) => {
                  setGoalTitle(e.target.value);
                }}
                className={styles.goalInput}
                type="text"
                placeholder="enter goal"
              />
              <select
                value={goalCategory}
                onChange={(e) => {
                  setGoalCategory(e.target.value);
                }}
                className={styles.goalSelect}
              >
                <option value="Work">work</option>
                <option value="Fitness">fitness</option>
                <option value="Learning">learning</option>
                <option value="Personal">personal</option>
              </select>

              <div className={styles.modalButtons}>
                <button className={styles.submitButton} type="submit">
                  {selectedGoal !== null ? "update goal" : "add goal"}
                </button>
                <button
                  className={styles.cancelButton}
                  type="button"
                  onClick={closeAndResetModal}
                >
                  cancel
                </button>
                {selectedGoal && (
                  <button
                    onClick={handleDelete}
                    className={styles.deleteButton}
                    type="button"
                  >
                    <FaRegTrashAlt />
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
