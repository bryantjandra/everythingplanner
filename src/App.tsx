import styles from "./App.module.css";
import Calendar from "./components/Calendar/Calendar";
import TodoCard from "./components/TodoCard/TodoCard";
import { useState } from "react";

function App() {
  const date = new Date();
  const todaysDate = date.toLocaleDateString("en-CA");
  const [currDate, setCurrDate] = useState(todaysDate);
  return (
    <div className={styles.mainContainer}>
      <Calendar currDate={currDate} onDateChange={setCurrDate} />
      <TodoCard currDate={currDate} />
    </div>
  );
}

export default App;
