import { useState, useEffect } from "react";
import { LuUndo2 } from "react-icons/lu";
import { MdSwitchRight } from "react-icons/md";
import styles from "./Pomodoro.module.css";
import pomodoroSparkle from "../../assets/pomodoroSparkle.mp3";

const DEFAULT_TIME_WORK = 3600;
const DEFAULT_TIME_REST = 900;

interface PomodoroProps {
  allSessions: Record<string, number>;
  onSessionChange: (allSessions: Record<string, number>) => void;
  currDate: string;
}

export default function Pomodoro({
  allSessions,
  onSessionChange,
  currDate,
}: PomodoroProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(DEFAULT_TIME_WORK);
  const [mode, setMode] = useState<"Work" | "Rest">("Work");

  function formatTime(s: number) {
    const minutes = Math.floor(s / 60);
    const seconds = s % 60;

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  useEffect(() => {
    if (!isRunning) return;
    const endTimestamp = Date.now() + seconds * 1000;
    const intervalId = setInterval(() => {
      setSeconds(() => {
        const remainingTime = Math.ceil((endTimestamp - Date.now()) / 1000);
        if (remainingTime <= 0) {
          return 0;
        }
        return remainingTime;
      });
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [isRunning]);

  useEffect(() => {
    if (isRunning) {
      document.title = `everythingplanner - ${formatTime(seconds)}`;
    }
    if (seconds === 0) {
      document.title = "everythingplanner";
      setIsRunning(false);
      const audioDing = new Audio(pomodoroSparkle);
      audioDing.play();
      if (mode === "Work") {
        onSessionChange({
          ...allSessions,
          [currDate]: (allSessions[currDate] || 0) + 1,
        });
      }
      setMode(mode === "Work" ? "Rest" : "Work");
    }
  }, [seconds]);

  useEffect(() => {
    setSeconds(mode === "Work" ? DEFAULT_TIME_WORK : DEFAULT_TIME_REST);
  }, [mode]);

  return (
    <>
      <div className={styles.clockTimer}>
        <div className={styles.counterContainer}>
          deep work sessions:{" "}
          {allSessions[currDate] ? allSessions[currDate] : 0}
        </div>

        <div className={styles.clockTimerTop}>
          <button
            className={styles.topButton}
            onClick={() => {
              setIsRunning(false);
              setMode(mode === "Work" ? "Rest" : "Work");
            }}
          >
            <MdSwitchRight />
          </button>
          <span>{formatTime(seconds)} </span>

          <button
            className={styles.topButton}
            onClick={() => {
              setIsRunning(false);
              setSeconds(
                mode === "Work" ? DEFAULT_TIME_WORK : DEFAULT_TIME_REST,
              );
            }}
          >
            <LuUndo2 />
          </button>
        </div>

        <div className={styles.clockButtons}>
          <button
            className={styles.playButton}
            onClick={() => {
              setIsRunning(!isRunning);
            }}
          >
            <div className={styles.circleContainer}>
              <div
                className={`${styles.stopSquare} ${isRunning ? styles.visible : ""}`}
              ></div>
            </div>
          </button>
        </div>
      </div>
    </>
  );
}
