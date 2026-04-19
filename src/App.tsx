import styles from "./App.module.css";
import Calendar from "./components/Calendar/Calendar";
import TodoCard from "./components/TodoCard/TodoCard";
import Pomodoro from "./components/Pomodoro/Pomodoro";
import GoalTracker from "./components/GoalTracker/GoalTracker";
import { FaRegCalendarAlt } from "react-icons/fa";
import { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { IoLockClosedOutline } from "react-icons/io5";

export interface Todo {
  text: string;
  completed: boolean;
}

function App() {
  const date = new Date();
  const todaysDate = date.toLocaleDateString("en-CA");
  const [currDate, setCurrDate] = useState(todaysDate);
  const [allTodos, setAllTodos] = useState<Record<string, Todo[]>>(() => {
    const saved = localStorage.getItem("allTodos");
    return saved ? JSON.parse(saved) : {};
  });

  const [allSessions, setAllSessions] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem("allSessions");
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    const newTodos = JSON.stringify(allTodos);
    localStorage.setItem("allTodos", newTodos);
  }, [allTodos]);

  useEffect(() => {
    const newSessions = JSON.stringify(allSessions);
    localStorage.setItem("allSessions", newSessions);
  }, [allSessions]);

  return (
    <>
      <div className={styles.navbar}>
        <Link to="/goals">
          <IoLockClosedOutline className={styles.goalLogo} />
        </Link>
        <Pomodoro
          currDate={currDate}
          allSessions={allSessions}
          onSessionChange={setAllSessions}
        />
        <Link to="/">
          <FaRegCalendarAlt className={styles.calendarLogo} />
        </Link>
      </div>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <div className={styles.mainContainer}>
                <Calendar
                  allTodos={allTodos}
                  currDate={currDate}
                  onDateChange={setCurrDate}
                />
                <TodoCard
                  allTodos={allTodos}
                  onTodoChange={setAllTodos}
                  currDate={currDate}
                />
              </div>
            </>
          }
        />
        <Route path="/goals" element={<GoalTracker />} />
      </Routes>
    </>
  );
}

export default App;
