import styles from "./TodoCard.module.css";
import { useState } from "react";
import type { Todo } from "../../App";
import { FaRegTrashAlt } from "react-icons/fa";

interface TodoCardProps {
  currDate: string;
  allTodos: Record<string, Todo[]>;
  onTodoChange: (allTodos: Record<string, Todo[]>) => void;
}

export default function TodoCard({
  currDate,
  allTodos,
  onTodoChange,
}: TodoCardProps) {
  const [inputText, setInputText] = useState("");
  const [isShaking, setIsShaking] = useState(false);

  let currentTodos = allTodos[currDate] || [];
  const [edittingIndex, setEdittingIndex] = useState<number>();
  const [todoInput, setTodoInput] = useState("");

  function handleInputChange(e) {
    setInputText(e.target.value);
  }

  function handleTodoInputChange(e) {
    setTodoInput(e.target.value);
  }

  function handleDeleteTodo(index: number) {
    const updatedTodos = currentTodos.filter((_, i) => {
      if (i === index) {
        return false;
      }
      return true;
    });
    if (updatedTodos.length === 0) {
      const { [currDate]: _, ...rest } = allTodos;
      onTodoChange(rest);
    } else {
      onTodoChange({ ...allTodos, [currDate]: updatedTodos });
    }
  }

  function handleToggleTodo(index: number) {
    const updatedTodos = currentTodos.map((todo, i) => {
      if (i === index) {
        return { ...todo, completed: !todo.completed };
      }
      return todo;
    });
    onTodoChange({ ...allTodos, [currDate]: updatedTodos });
  }

  function handleEditTodo(index: number) {
    setEdittingIndex(index);
    setTodoInput(currentTodos[index].text);
  }

  return (
    <>
      {currDate && (
        <div className={styles.cardTodoList}>
          <span className={styles.title}>Today's date is: {currDate} </span>
          <input
            value={inputText}
            className={`${styles.inputTodo} ${isShaking ? styles.shake : ""}`}
            onAnimationEnd={() => {
              setIsShaking(false);
            }}
            placeholder="enter what to do."
            onChange={(e) => {
              handleInputChange(e);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (inputText === "") {
                  setIsShaking(true);
                  return;
                }
                currentTodos = [
                  ...currentTodos,
                  { text: inputText, completed: false },
                ];
                onTodoChange({ ...allTodos, [currDate]: currentTodos });
                setInputText("");
              }
            }}
          />
          <ul className={styles.todoList}>
            {currentTodos.map((todo, index) => {
              return (
                <li
                  onDoubleClick={() => {
                    handleEditTodo(index);
                  }}
                  className={styles.todoItem}
                  key={index}
                >
                  <div className={styles.todoLeft}>
                    {index === edittingIndex ? (
                      <input
                        autoFocus
                        value={todoInput}
                        className={`${styles.todoInput} ${isShaking ? styles.shake : ""}`}
                        onAnimationEnd={() => {
                          setIsShaking(false);
                        }}
                        onChange={(e) => {
                          handleTodoInputChange(e);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Escape") {
                            setEdittingIndex(undefined);
                            return;
                          }
                          if (e.key === "Enter") {
                            if (todoInput === "") {
                              setIsShaking(true);
                              return;
                            }
                            const updatedTodos = currentTodos.map(
                              (todo, index) => {
                                if (index === edittingIndex) {
                                  return { ...todo, text: todoInput };
                                }
                                return todo;
                              },
                            );
                            onTodoChange({
                              ...allTodos,
                              [currDate]: updatedTodos,
                            });
                            setEdittingIndex(undefined);
                          }
                        }}
                      />
                    ) : (
                      <span
                        className={
                          todo.completed
                            ? styles.completedTodo
                            : styles.unfinishedTodo
                        }
                      >
                        • {todo.text}
                      </span>
                    )}
                  </div>
                  <div className={styles.todoRight}>
                    <button
                      className={styles.todoButton}
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
