import { useRef, useEffect, useState } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import GameSettings from "./components/GameSettings/GameSettings";
import GameOrchestra from "./components/GameOrchestra/GameOrchestra";
import PlayersLeaderboard from "./components/PlayersLeaderboard/PlayersLeaderboard";
import styles from "./PrisonerDilemmaPlaygroundHost.module.css";
import { BACKEND_URL } from "../api_services";
import { WEB_APP_ROUTE } from "@/global/WebAppRoute";
import { useNavigate } from "react-router-dom";

export interface Player {
  id: string;
  name: string;
  points: number;
}
export interface GameConfig {
  points_both_cooperate: number;
  points_defect_against_cooperate: number;
  points_cooperate_against_defect: number;
  points_both_defect: number;
  allow_chat: boolean;
  anonymous_play: boolean;
  round_time_limit: number;
  number_of_rounds: number;
  show_round_count: boolean;
}

export default function PrisonerDilemmaPlaygroundHost() {
  const navigate = useNavigate();

  const rightPanelRef = useRef<HTMLDivElement>(null!);
  const settingsRef = useRef<HTMLDivElement>(null!);
  const orchestraRef = useRef<HTMLDivElement>(null!);
  const leaderboardRef = useRef<HTMLDivElement>(null!);

  const [players, setPlayers] = useState<Player[]>([]);
  const [currentRound, setCurrentRound] = useState<number>(0);
  const [gameConfig, setGameConfig] = useState<GameConfig | null>(null);

  // WebSocket 
  useEffect(() => {
    let ws: WebSocket | null = null;

    const gameId = localStorage.getItem("game_id")!;
    ws = new WebSocket(`ws://localhost:8000/ws/${gameId}`);

    ws.onopen = () => {
      ws!.send(JSON.stringify({ role: "host" }));
    };

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);

      if (data.type === "player_joined") {
        const newPlayer: Player = {
          id: data.player_id,
          name: data.player_name,
          points: 0,
        };

        setPlayers(prev => {
          if (prev.some(p => p.id === newPlayer.id)) return prev;
          return [...prev, newPlayer];
        });
      }

      if (data.type === "game_expired") {
        alert(data.message || "Game session expired due to inactivity.");

        localStorage.clear(); // or remove specific keys
        window.location.href = "/prisoner_dilemma_playground";
        return;
      }

      if (data.type === "player_left" && data.updated_player_list) {
        setPlayers(data.updated_player_list as Player[]);
        console.log(`Player ${data.player_password} left. Players updated.`);
        return;
      }
    };

    return () => {
      ws?.close();
    };
  }, []);

  // Get the game info once when load, redirect back to dashboard page if authen fail
  useEffect(() => {
    const fetchGameInfo = async () => {
      const gameId = localStorage.getItem("game_id");
      const gamePassword = localStorage.getItem("game_password");

      if (!gameId || !gamePassword) {
        navigate(WEB_APP_ROUTE.PRISONER_DILEMMA_PLAYGROUND, { replace: true });
        return;
      }

      try {
        const response = await fetch(`${BACKEND_URL}/host-get-game-info`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            game_id: gameId,
            game_password: gamePassword,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        setCurrentRound(data.current_round);
        setPlayers(
          data.players.map((p:any): Player => ({
            id: p.player_id,
            name: p.player_name,
            points: p.points_gained,
          }))
        );
        setGameConfig(data.game_config);
      } catch (err) {
        console.error("Failed to load game info:", err);
        navigate(WEB_APP_ROUTE.PRISONER_DILEMMA_PLAYGROUND, { replace: true });
      }
    };

    fetchGameInfo();
  }, []);

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
          <PlayersLeaderboard players={players} />
        </div>
      </div>
    </div>
  );
}