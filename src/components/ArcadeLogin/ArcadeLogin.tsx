import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { apiClient } from "../hooks/ApiClient";

export default function ArcadeLogin() {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");

  useEffect(() => {
    async function linkArcade() {
      try {
        await apiClient.post("/arcade/link-session", { session_id: sessionId });

        alert("✅ Arcade vinculada, ya puedes jugar en la máquina!");
      } catch (err) {
        console.error("Error al vincular la arcade:", err);
        alert("❌ Error al vincular la arcade");
      }
    }

    if (sessionId) {
      linkArcade();
    }
  }, [sessionId]);

  return <p>Conectando la arcade con tu sesión...</p>;
}
