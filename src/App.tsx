import styles from "./App.module.css";
import Calendar from "./components/Calendar/Calendar";
import TodoCard from "./components/TodoCard/TodoCard";
import Pomodoro from "./components/Pomodoro/Pomodoro";
import GoalTracker from "./components/GoalTracker/GoalTracker";
import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

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
    let newTodos = JSON.stringify(allTodos);
    localStorage.setItem("allTodos", newTodos);
  }, [allTodos]);

  useEffect(() => {
    let newSessions = JSON.stringify(allSessions);
    localStorage.setItem("allSessions", newSessions);
  }, [allSessions]);

  return (
    <Routes>
      <Route
        path="/todos"
        element={
          <>
            <div className={styles.navbar}>
              <Pomodoro
                currDate={currDate}
                allSessions={allSessions}
                onSessionChange={setAllSessions}
              />
            </div>
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
  );
}

export default App;
