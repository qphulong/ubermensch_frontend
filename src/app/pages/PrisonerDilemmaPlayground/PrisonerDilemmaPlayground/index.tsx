import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./PrisonerDilemmaPlayground.module.css";

const BACKEND = import.meta.env.VITE_BACKEND_URL;

export default function PrisonerDilemmaPlayground() {
  const navigate = useNavigate();

  const [joinGameId, setJoinGameId] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [playerId, setPlayerId] = useState("");

  const handleCreateGame = async () => {
    try {
      const res = await fetch(`${BACKEND}/create-game`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      if (!res.ok) throw new Error();

      const data = await res.json();

      localStorage.setItem("game_id", data.game_id);
      localStorage.setItem("game_password", data.game_password);

      navigate("/prisoner_dilemma_playground/host");
    } catch (err) {
      alert("Failed to create game");
    }
  };

  const handleJoinGame = async () => {
    try {
      const payload = {
        game_id: joinGameId,
        player_name: playerName,
        player_id: playerId,
      };

      const res = await fetch(`${BACKEND}/register-player`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.detail || "Fail");

      localStorage.setItem("game_id", joinGameId);
      localStorage.setItem("player_name", playerName);
      localStorage.setItem("player_id", playerId);
      localStorage.setItem("player_password", data.player_password);

      navigate("/prisoner_dilemma_playground/player");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Prisoner's Dilemma Playground</h1>

        <div className={styles.actions}>
          <aside className={styles.left}>
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Create a game</h2>
              <p className={styles.cardDesc}>
                Spin up a new match — you'll be the host and receive the game
                id.
              </p>

              <button className={styles.primaryButton} onClick={handleCreateGame}>
                Create Game
              </button>
            </div>
          </aside>

          <div className={styles.divider} aria-hidden />

          <section className={styles.right}>
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Join a game</h2>

              <div className={styles.form}>
                <label className={styles.label}>
                  Game ID
                  <input
                    className={styles.input}
                    value={joinGameId}
                    onChange={(e) => setJoinGameId(e.target.value)}
                    placeholder="e.g. Aa12"
                  />
                </label>

                <label className={styles.label}>
                  Player Name
                  <input
                    className={styles.input}
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Your display name"
                  />
                </label>

                <label className={styles.label}>
                  Player ID
                  <input
                    className={styles.input}
                    value={playerId}
                    onChange={(e) => setPlayerId(e.target.value)}
                    placeholder="Your private id - The host will used this to know who you are"
                  />
                </label>

                <div className={styles.row}>
                  <button className={styles.ghostButton} onClick={() => {
                    setJoinGameId("");
                    setPlayerName("");
                    setPlayerId("");
                  }}>
                    Clear
                  </button>

                  <button className={styles.primaryButton} onClick={handleJoinGame}>
                    Join
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
