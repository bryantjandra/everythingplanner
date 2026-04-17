import { useParams } from "react-router-dom";

export default function YearlyGoal() {
  const params = useParams();
  return <div>my goal for {params.year}</div>;
}
