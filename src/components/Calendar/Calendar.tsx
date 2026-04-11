import { DatePicker } from "@douyinfe/semi-ui";
import type { Todo } from "../../App";
import styles from "./Calendar.module.css";

interface CalendarProps {
  onDateChange: (date: string) => void;
  currDate: string;
  allTodos: Record<string, Todo[]>;
}

export default function Calendar({
  onDateChange,
  currDate,
  allTodos,
}: CalendarProps) {
  function renderDate(dayNumber?: number, fullDate?: string) {
    if (!fullDate) return dayNumber;
    if (allTodos[fullDate]) {
      const currTodos = allTodos[fullDate];
      const allCompleted = currTodos.every((todo: Todo) => {
        return todo.completed;
      });
      return (
        <div className={styles.dateItemContainer}>
          {dayNumber}
          <span
            className={
              allCompleted ? styles.todoDotCompleted : styles.todoDotOngoing
            }
          />
        </div>
      );
    }
    return dayNumber;
  }

  return (
    <>
      <DatePicker
        className={styles.calendar}
        defaultValue={currDate}
        placeholder={"hey phinneas, whatcha dooooin"}
        onChange={(_, dateString) => {
          onDateChange(dateString as string);
        }}
        renderDate={renderDate}
      />
    </>
  );
}
