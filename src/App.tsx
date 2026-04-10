import styles from "./App.module.css";
import Calendar from "./components/Calendar/Calendar";
import TodoCard from "./components/TodoCard/TodoCard";
import { useState, useEffect } from "react";

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

  useEffect(() => {
    let newTodos = JSON.stringify(allTodos);
    localStorage.setItem("allTodos", newTodos);
  }, [allTodos]);

  return (
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
  );
}

export default App;
