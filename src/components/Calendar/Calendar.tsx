import { DatePicker } from "@douyinfe/semi-ui";
import styles from "./Calendar.module.css";

interface CalendarProps {
  onDateChange: (date: string) => void;
}

export default function Calendar({ onDateChange }: CalendarProps) {
  return (
    <>
      <DatePicker
        className={styles.calendar}
        placeholder={"hey phinneas, whatcha dooooin"}
        onChange={(_, dateString) => {
          onDateChange(dateString as string);
        }}
      />
    </>
  );
}
