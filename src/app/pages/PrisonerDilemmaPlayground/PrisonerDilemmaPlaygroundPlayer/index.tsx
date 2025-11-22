import { useState, useEffect, useRef } from "react";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL; 

export default function PrisonerDilemmaPlaygroundPlayer() {

  useEffect(() => {
      let ws: WebSocket | null = null;

      const gameId = localStorage.getItem("game_id");
      const playerId = localStorage.getItem("player_id")!;
      const playerName = localStorage.getItem("player_name")!;

      ws = new WebSocket(`ws://localhost:8000/ws/${gameId}`);

      ws.onopen = () => {
        console.log("[Player WS] open → sending identity");
        ws!.send(JSON.stringify({
          role: "player",
          player_id: playerId,
          player_name: playerName
        }));
      };

      ws.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);

          if (data.type === "game_expired") {
            alert(data.message || "Game session expired due to inactivity.");

            localStorage.clear();
            window.location.href = "/prisoner_dilemma_playground";
            return;
          }

          // ... handle other messages
        } catch (e) {
          console.error("Invalid WS message", e);
        }
      };

      ws.onclose = () => console.log("[Player WS] closed");
      ws.onerror = (e) => console.error("[Player WS] error", e);

      return () => {
        ws?.close();
      };
    }, []);

  return <div>Player</div>;
}
