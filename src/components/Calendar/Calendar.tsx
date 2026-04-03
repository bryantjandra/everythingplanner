import { DatePicker } from "@douyinfe/semi-ui";
import styles from "./Calendar.module.css";

export default function Calendar() {
  return (
    <DatePicker
      className={styles.calendar}
      placeholder={"hey phinneas, whatcha dooooin"}
    />
  );
}
