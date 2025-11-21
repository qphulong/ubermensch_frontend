import { useState, useEffect, useRef } from "react";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL; 

export default function PrisonerDilemmaPlaygroundPlayer() {

  useEffect(() => {
      let ws: WebSocket | null = null;

      const gameId = localStorage.getItem("game_id");
      const playerId = localStorage.getItem("player_id")!;

      ws = new WebSocket(`ws://localhost:8000/ws/${gameId}`);

      ws.onopen = () => {
        console.log("[Player WS] open → sending identity");
        ws!.send(JSON.stringify({
          role: "player",
          player_id: playerId
        }));
      };

      ws.onmessage = (e) => {
        console.log("[Player WS] received", e.data);
        // future: countdown, chat, etc.
      };

      ws.onclose = () => console.log("[Player WS] closed");
      ws.onerror = (e) => console.error("[Player WS] error", e);

      return () => {
        ws?.close();
      };
    }, []);

  return <div>Player</div>;
}
