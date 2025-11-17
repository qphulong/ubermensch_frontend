import { useState } from "react";
import { ChangeEvent } from 'react';
import { useNavigate } from "react-router-dom";
import styles from "./PrisonerDilemmaPlayground.module.css";

const BACKEND = import.meta.env.VITE_BACKEND_URL;

export default function PrisonerDilemmaPlayground() {
  const navigate = useNavigate();

  const [joinGameId, setJoinGameId] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [playerId, setPlayerId] = useState("");
  const [newGameConfig, setNewGameConfig] = useState({
    points_both_cooperate: 7,
    points_defect_against_cooperate: 10,
    points_cooperate_against_defect: 0,
    points_both_defect: 1,

    allow_chat: true,
    anonymous_play: true,

    round_time_limit: 60,
    number_of_rounds: 10,
    show_round_count: false,
  });


  const handleCreateGame = async () => {
    try {
      const res = await fetch(`${BACKEND}/create-game`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newGameConfig),
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

  const handleNumber = (field: string, min: number, max: number) => (e: ChangeEvent<HTMLInputElement>) => {
    let v = Number(e.target.value);
    if (isNaN(v)) v = min;
    v = Math.max(min, Math.min(max, v));
    setNewGameConfig((c) => ({ ...c, [field]: v }));
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
              <div className={styles.form}>

                <label className={styles.label}>
                  Points: both cooperate
                  <input
                    className={styles.input}
                    type="number"
                    value={newGameConfig.points_both_cooperate}
                    onChange={handleNumber("points_both_cooperate", 0, 100)}
                  />
                </label>

                <label className={styles.label}>
                  Points: defect vs cooperate
                  <input
                    className={styles.input}
                    type="number"
                    value={newGameConfig.points_defect_against_cooperate}
                    onChange={handleNumber("points_defect_against_cooperate", 0, 100)}
                  />
                </label>

                <label className={styles.label}>
                  Points: cooperate vs defect
                  <input
                    className={styles.input}
                    type="number"
                    value={newGameConfig.points_cooperate_against_defect}
                    onChange={handleNumber("points_cooperate_against_defect", 0, 100)}
                  />
                </label>

                <label className={styles.label}>
                  Points: both defect
                  <input
                    className={styles.input}
                    type="number"
                    value={newGameConfig.points_both_defect}
                    onChange={handleNumber("points_both_defect", 0, 100)}
                  />
                </label>

                <label className={styles.label}>
                  Allow chat
                  <select
                    className={styles.input}
                    value={newGameConfig.allow_chat ? "true" : "false"}
                    onChange={(e) =>
                      setNewGameConfig((c) => ({ ...c, allow_chat: e.target.value === "true" }))
                    }
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </label>

                <label className={styles.label}>
                  Anonymous play
                  <select
                    className={styles.input}
                    value={newGameConfig.anonymous_play ? "true" : "false"}
                    onChange={(e) =>
                      setNewGameConfig((c) => ({ ...c, anonymous_play: e.target.value === "true" }))
                    }
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </label>

                <label className={styles.label}>
                  Round time limit (sec)
                  <input
                    className={styles.input}
                    type="number"
                    value={newGameConfig.round_time_limit}
                    onChange={handleNumber("round_time_limit", 0, 180)}
                  />
                </label>

                <label className={styles.label}>
                  Number of rounds
                  <input
                    className={styles.input}
                    type="password"
                    value={newGameConfig.number_of_rounds}
                    onChange={handleNumber("number_of_rounds", 1, 100)}
                  />
                </label>

                <label className={styles.label}>
                  Show round count
                  <select
                    className={styles.input}
                    value={newGameConfig.show_round_count ? "true" : "false"}
                    onChange={(e) =>
                      setNewGameConfig((c) => ({ ...c, show_round_count: e.target.value === "true" }))
                    }
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </label>
              
                <div className={styles.row}>
                  <button className={styles.primaryButton} onClick={handleCreateGame}>
                    Create Game
                  </button>
                </div>
              </div>
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
