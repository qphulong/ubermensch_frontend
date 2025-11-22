import { useState, useMemo } from "react";
import styles from "./PlayersLeaderboard.module.css";
import { Player } from "../..";
interface PlayersLeaderboardProps {
  players: Player[];
}

export default function PlayersLeaderboard({ players }: PlayersLeaderboardProps) {
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  const toggleSort = () => {
    setSortOrder(prev => (prev === "desc" ? "asc" : "desc"));
  };

  const sortedPlayers = useMemo(() => {
    return [...players].sort((a, b) =>
      sortOrder === "desc" ? b.points - a.points : a.points - b.points
    );
  }, [players, sortOrder]);

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
          {sortedPlayers.length === 0 ? (
            <div className={styles.emptyState}>No players yet. Waiting for warriors...</div>
          ) : (
            sortedPlayers.map((player, index) => (
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
            ))
          )}
        </div>
      </div>

      {/* Right Spare Area - 25% */}
      <div className={styles.playerLeaderBoardSpareRightSection}>
        {/* Future content: live chat, top donors, events, etc. */}
      </div>
    </div>
  );
}