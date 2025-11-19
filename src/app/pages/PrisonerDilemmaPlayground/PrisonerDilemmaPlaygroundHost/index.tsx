import { useRef } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import GameSettings from "./components/GameSettings/GameSettings";
import GameOrchestra from "./components/GameOrchestra/GameOrchestra";
import PlayersLeaderboard from "./components/PlayersLeaderboard/PlayersLeaderboard";
import styles from "./PrisonerDilemmaPlaygroundHost.module.css";

export default function PrisonerDilemmaPlaygroundHost() {
  const rightPanelRef = useRef<HTMLDivElement>(null!);
  const settingsRef = useRef<HTMLDivElement>(null!);
  const orchestraRef = useRef<HTMLDivElement>(null!);
  const leaderboardRef = useRef<HTMLDivElement>(null!);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    if (!rightPanelRef.current || !ref.current) return;

    const panel = rightPanelRef.current;
    const target = ref.current;

    const panelTop = panel.scrollTop;
    const panelOffset = panel.getBoundingClientRect().top;
    const targetOffset = target.getBoundingClientRect().top;

    const offset = targetOffset - panelOffset + panelTop - 80;

    panel.scrollTo({
      top: offset,
      behavior: "smooth",
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <Sidebar
          onSelect={(key) => {
            if (key === "settings") scrollToSection(settingsRef);
            if (key === "orchestra") scrollToSection(orchestraRef);
            if (key === "leaderboard") scrollToSection(leaderboardRef);
          }}
        />
      </div>

      <div ref={rightPanelRef} className={styles.rightPanel}>
        <div ref={settingsRef}>
          <GameSettings />
        </div>
        <div ref={orchestraRef}>
          <GameOrchestra />
        </div>
        <div ref={leaderboardRef}>
          <PlayersLeaderboard />
        </div>
      </div>
    </div>
  );
}