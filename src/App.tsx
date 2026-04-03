import styles from "./App.module.css";
import Calendar from "./components/Calendar/Calendar";

function App() {
  return (
    <div className={styles.mainContainer}>
      <Calendar />
    </div>
  );
}

export default App;
