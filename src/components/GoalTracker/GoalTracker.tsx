import styles from "./GoalTracker.module.css";
import { useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { Tabs, TabPane } from "@douyinfe/semi-ui";
import { FaLaptopCode } from "react-icons/fa";
import { IoMdFitness } from "react-icons/io";
import { LuBrain } from "react-icons/lu";
import { CgProfile } from "react-icons/cg";

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

  const [isModalOpen, setModalOpen] = useState(false);

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
              Work
            </TabPane>
            <TabPane
              className={styles.tabText}
              tab={<IoMdFitness />}
              itemKey="2"
            >
              Fitness
            </TabPane>
            <TabPane className={styles.tabText} tab={<LuBrain />} itemKey="3">
              Learning
            </TabPane>
            <TabPane className={styles.tabText} tab={<CgProfile />} itemKey="4">
              Personal
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
        <div
          onClick={() => {
            setModalOpen(false);
          }}
          className={styles.overlayModal}
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            className={styles.modal}
          >
            <form className={styles.modalForm}>
              <input
                className={styles.goalInput}
                type="text"
                placeholder="enter goal"
              />
              <select className={styles.goalSelect}>
                <option value="Work">work</option>
                <option value="Fitness">fitness</option>
                <option value="Learning">learning</option>
                <option value="Personal">personal</option>
              </select>

              <div className={styles.modalButtons}>
                <button className={styles.submitButton} type="submit">
                  add goal
                </button>
                <button
                  className={styles.cancelButton}
                  type="button"
                  onClick={() => {
                    setModalOpen(false);
                  }}
                >
                  cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
