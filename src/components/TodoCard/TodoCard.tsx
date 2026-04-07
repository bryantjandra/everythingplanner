import styles from "./TodoCard.module.css";
import { useState, useEffect } from "react";
import { FaRegTrashAlt } from "react-icons/fa";

interface TodoCardProps {
  currDate: string;
}

interface Todo {
  text: string;
  completed: boolean;
}

export default function TodoCard({ currDate }: TodoCardProps) {
  const [allTodos, setAllTodos] = useState<Record<string, Todo[]>>(() => {
    const saved = localStorage.getItem("allTodos");
    return saved ? JSON.parse(saved) : {};
  });
  const [inputText, setInputText] = useState("");

  let currentTodos = allTodos[currDate] || [];

  function handleInputChange(e) {
    setInputText(e.target.value);
  }

  function handleDeleteTodo(index: number) {
    const updatedTodos = currentTodos.filter((_, i) => {
      if (i === index) {
        return false;
      }
      return true;
    });
    setAllTodos({ ...allTodos, [currDate]: updatedTodos });
  }

  function handleToggleTodo(index: number) {
    const updatedTodos = currentTodos.map((todo, i) => {
      if (i === index) {
        return { ...todo, completed: !todo.completed };
      }
      return todo;
    });
    setAllTodos({ ...allTodos, [currDate]: updatedTodos });
  }

  useEffect(() => {
    let newTodos = JSON.stringify(allTodos);
    localStorage.setItem("allTodos", newTodos);
  }, [allTodos]);

  return (
    <>
      {currDate && (
        <div className={styles.cardTodoList}>
          <span className={styles.title}>Today's date is: {currDate} </span>
          <input
            value={inputText}
            className={styles.inputTodo}
            placeholder="enter what to do."
            onChange={(e) => {
              handleInputChange(e);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                currentTodos = [
                  ...currentTodos,
                  { text: inputText, completed: false },
                ];
                setAllTodos({ ...allTodos, [currDate]: currentTodos });
                setInputText("");
              }
            }}
          />
          <ul className={styles.todoList}>
            {currentTodos.map((todo, index) => {
              return (
                <li className={styles.todoItem} key={index}>
                  <div className={styles.todoLeft}>
                    <span
                      className={
                        todo.completed
                          ? styles.completedTodo
                          : styles.unfinishedTodo
                      }
                    >
                      • {todo.text}
                    </span>
                  </div>
                  <div className={styles.todoRight}>
                    <button
                      className={styles.deleteButton}
                      onClick={() => {
                        handleDeleteTodo(index);
                      }}
                    >
                      <FaRegTrashAlt />
                    </button>
                    <input
                      className={styles.checkboxTodo}
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => {
                        handleToggleTodo(index);
                      }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </>
  );
}
