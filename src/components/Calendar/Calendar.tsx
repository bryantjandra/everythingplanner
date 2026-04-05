import { DatePicker } from "@douyinfe/semi-ui";
import styles from "./Calendar.module.css";
import { useState } from "react";

export default function Calendar() {
  const [currDate, setCurrDate] = useState("");
  const [todos, setTodos] = useState<string[]>([]);
  const [inputText, setInputText] = useState("");

  function handleInputChange(e) {
    setInputText(e.target.value);
  }

  return (
    <>
      <DatePicker
        className={styles.calendar}
        placeholder={"hey phinneas, whatcha dooooin"}
        onChange={(date, dateString) => {
          setCurrDate(dateString as string);
        }}
      />
      {currDate && (
        <div className={styles.cardTodoList}>
          <span className={styles.title}>Today's date is: {currDate} </span>
          <input
            value={inputText}
            className={styles.inputTodo}
            placeholder="enter todos."
            onChange={(e) => {
              handleInputChange(e);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setTodos([...todos, inputText]);
                setInputText("");
              }
            }}
          />
          <ul className={styles.todoList}>
            {todos.map((todo, index) => {
              return <li key={index}>{todo}</li>;
            })}
          </ul>
        </div>
      )}
    </>
  );
}
