import { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { invoke } from "@tauri-apps/api";

function App() {
  const [gameState, setGameState] = useState<any>("");
  const [gameRefreshTime, setGameRefreshTime] = useState<number>(500);

  const handle_reset = () => {
    invoke("reset_game");
  };

  useEffect(() => {
    const interval = setInterval(() => {
      invoke("tick_game").then(() => {
        invoke("get_game_state").then((res) => setGameState(res));
      });
    }, 1000 - gameRefreshTime);
    return () => clearInterval(interval);
  }, [gameRefreshTime]);

  return (
    <main className="App">
      <header className="App-header">
        <div className="game">{gameState}</div>
        <button onClick={handle_reset} className="btn">
          Reset
        </button>

        <input
          className="range"
          type="range"
          onChange={(e) => setGameRefreshTime(parseInt(e.target.value))}
          value={gameRefreshTime}
          min="0"
          max="1000"
        />
      </header>
    </main>
  );
}

export default App;
