import { useState, useEffect } from "react";
import styles from "./Pomodoro.module.css";

const DEFAULT_TIME_WORK = 2700;
const DEFAULT_TIME_REST = 900;

export default function Pomodoro() {
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
    const intervalId = setInterval(() => {
      setSeconds((seconds) => {
        if (seconds <= 0) return 0;
        return seconds - 1;
      });
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [isRunning]);

  useEffect(() => {
    if (seconds === 0) {
      setIsRunning(false);
      setMode(mode === "Work" ? "Rest" : "Work");
    }
  }, [seconds]);

  useEffect(() => {
    setSeconds(mode === "Work" ? DEFAULT_TIME_WORK : DEFAULT_TIME_REST);
  }, [mode]);

  return (
    <div className={styles.clockTimer}>
      <div>{formatTime(seconds)}</div>

      <div className={styles.clockButtons}>
        <button
          className={styles.clockButton}
          onClick={() => {
            setIsRunning(true);
          }}
        >
          Start
        </button>
        <button
          className={styles.clockButton}
          onClick={() => {
            setIsRunning(false);
          }}
        >
          Stop
        </button>
        <button
          className={styles.clockButton}
          onClick={() => {
            setIsRunning(false);
            setSeconds(mode === "Work" ? DEFAULT_TIME_WORK : DEFAULT_TIME_REST);
          }}
        >
          Reset
        </button>
        <button
          className={styles.clockButton}
          onClick={() => {
            setIsRunning(false);
            setMode(mode === "Work" ? "Rest" : "Work");
          }}
        >
          Switch Mode
        </button>
      </div>
    </div>
  );
}
