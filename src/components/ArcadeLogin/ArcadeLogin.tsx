import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

export default function ArcadeLogin() {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");

  useEffect(() => {
    async function linkArcade() {
      try {
        // Aquí ya deberías tener el token del usuario logeado
        const token = localStorage.getItem("access_token");

        await axios.post(
          "https://api.gamedev.study/arcade/link-session",
          { session_id: sessionId }, // se manda como JSON body
          { headers: { Authorization: `Bearer ${token}` } }
        );

        alert("✅ Arcade vinculada, ya puedes jugar en la máquina!");
      } catch (err) {
        console.error(err);
        alert("❌ Error al vincular la arcade");
        console.error("Error al vincular la arcade:", err);
      }
    }

    if (sessionId) {
      linkArcade();
    }
  }, [sessionId]);

  return <p>Conectando la arcade con tu sesión...</p>;
}
