import styles from "./Sidebar.module.css";
import { Settings, Users, SlidersHorizontal } from "lucide-react";

export default function Sidebar({
  onSelect,
}: {
  onSelect: (key: string) => void;
}) {
  return (
    <div className={styles.sidebar}>
      <button onClick={() => onSelect("settings")}>
        <Settings size={48} />
      </button>

      <button onClick={() => onSelect("orchestra")}>
        <SlidersHorizontal size={48} />
      </button>

      <button onClick={() => onSelect("leaderboard")}>
        <Users size={48} />
      </button>
    </div>
  );
}
