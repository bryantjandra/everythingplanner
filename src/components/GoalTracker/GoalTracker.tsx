import styles from "./GoalTracker.module.css";
import { useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { Tabs, TabPane } from "@douyinfe/semi-ui";

interface Goal {
  title: string;
  category: "Work" | "Fitness" | "Learning" | "Personal";
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

  function handleClick() {
    const currentYear = new Date().getFullYear();
    const updatedGoals = JSON.stringify({ ...allGoals, [currentYear]: [] });
    localStorage.setItem("allGoals", updatedGoals);
  }

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
          {currentMonth === 12 && (
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
            <TabPane className={styles.tabText} tab="Work" itemKey="1">
              Work
            </TabPane>
            <TabPane className={styles.tabText} tab="Fitness" itemKey="2">
              Fitness
            </TabPane>
            <TabPane className={styles.tabText} tab="Learning" itemKey="3">
              Learning
            </TabPane>
            <TabPane className={styles.tabText} tab="Personal" itemKey="4">
              Personal
            </TabPane>
          </Tabs>
        </div>
      </div>
    </>
  );
}
