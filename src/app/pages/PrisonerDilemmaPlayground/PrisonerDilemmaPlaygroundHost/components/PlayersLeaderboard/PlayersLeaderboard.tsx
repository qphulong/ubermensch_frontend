// PlayersLeaderboard.tsx
import { useState, useMemo } from "react";
import styles from "./PlayersLeaderboard.module.css";

interface Player {
  id: string;
  name: string;
  points: number;
}

const mockPlayers: Player[] = [
  { id: "p001", name: "DragonSlayer", points: 2850 },
  { id: "p002", name: "NinjaWarrior", points: 3120 },
  { id: "p003", name: "PhoenixRise", points: 2670 },
  { id: "p004", name: "ShadowHunter", points: 2999 },
  { id: "p005", name: "StormBringer", points: 3410 },
  { id: "p006", name: "IceQueen", points: 2580 },
  { id: "p007", name: "ThunderBolt", points: 3200 },
  { id: "p008", name: "MysticFox", points: 2750 },
  { id: "p009", name: "VoidWalker", points: 3670 },
  { id: "p010", name: "StarFury", points: 2980 },
  { id: "p011", name: "CosmicBlade", points: 3520 },
  { id: "p012", name: "NeonGhost", points: 3010 },
];

export default function PlayersLeaderboard() {
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  const toggleSort = () => {
    setSortOrder(prev => prev === "desc" ? "asc" : "desc");
  };

  const sortedPlayers = useMemo(() => {
    return [...mockPlayers].sort((a, b) =>
      sortOrder === "desc" ? b.points - a.points : a.points - b.points
    );
  }, [sortOrder]);

  return (
    <div className={styles.playerLeaderBoardSection}>
      {/* Left Spare Area - 25% */}
      <div className={styles.playerLeaderBoardSpareLeftSection}>
        {/* You can put ads, stats, or anything here later */}
      </div>

      {/* Main Leaderboard - 50% */}
      <div className={styles.playerLeaderboardContainer}>
        {/* Header */}
        <div className={styles.leaderboardHeader}>
          <div className={styles.colRank}>#</div>
          <div className={styles.colPlayer}>Player</div>
          <div className={styles.colPoints} onClick={toggleSort}>
            Points
            <span className={styles.sortIcon}>
              {sortOrder === "desc" ? "↓" : "↑"}
            </span>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className={styles.leaderboardBody}>
          {sortedPlayers.map((player, index) => (
            <div key={player.id} className={styles.playerRow}>
              <div className={styles.colRank}>{index + 1}</div>
              <div className={styles.colPlayer}>
                <div className={styles.playerName}>{player.name}</div>
                <div className={styles.playerId}>#{player.id}</div>
              </div>
              <div className={styles.colPoints}>
                {player.points.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Spare Area - 25% */}
      <div className={styles.playerLeaderBoardSpareRightSection}>
        {/* Future content: live chat, top donors, events, etc. */}
      </div>
    </div>
  );
}