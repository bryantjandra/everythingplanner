import styles from "./App.module.css";
import Calendar from "./components/Calendar/Calendar";
import TodoCard from "./components/TodoCard/TodoCard";
import { useState } from "react";

function App() {
  const [currDate, setCurrDate] = useState("");
  return (
    <div className={styles.mainContainer}>
      <Calendar onDateChange={setCurrDate} />
      <TodoCard currDate={currDate} />
    </div>
  );
}

export default App;
