import { DatePicker } from "@douyinfe/semi-ui";
import styles from "./Calendar.module.css";

interface CalendarProps {
  onDateChange: (date: string) => void;
  currDate: string;
}

export default function Calendar({ onDateChange, currDate }: CalendarProps) {
  const allTodos = localStorage.getItem("allTodos");
  const allTodosParsed = allTodos ? JSON.parse(allTodos) : {};
  function renderDate(dayNumber?: number, fullDate?: string) {
    if (!fullDate) return dayNumber;
    if (allTodosParsed[fullDate] && allTodosParsed[fullDate].length > 0) {
      return (
        <div className={styles.dateItemContainer}>
          {dayNumber}
          <span className={styles.todoDot} />
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
