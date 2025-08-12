// PodiumChart.tsx
import React from "react";
import { motion } from "framer-motion";

type PodiumUser = {
  username: string;
  score: number;
  profilePicture?: string; // coincide con tu UserLeaderboard.profilePicture
};

interface Props {
  users: PodiumUser[];
}

const SLOT_ORDER = [3, 1, 0, 2, 4]; // left->right: 4º, 2º, 1º, 3º, 5º
const HEIGHT_BY_RANK: Record<number, number> = {
  0: 220, // 1st
  1: 170, // 2nd
  2: 150, // 3rd
  3: 110, // 4th
  4: 90, // 5th
};

export default function PodiumChart({ users }: Props) {
  const top = [...users]
    .sort((a, b) => (b.score || 0) - (a.score || 0))
    .slice(0, 5);

  // Construir los 5 "slots" para mostrar (pueden ser null si no hay jugador)
  const slots = SLOT_ORDER.map((idx) => (idx < top.length ? top[idx] : null));

  return (
    <motion.div
      className="podium-container"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      aria-label="Podio top 5"
    >
      {slots.map((user, slotIndex) => {
        // Si user es null mostramos placeholder
        const rankIndex = SLOT_ORDER[slotIndex]; // índice relativo en top (ej: 0=1er)
        const pillarHeight = HEIGHT_BY_RANK[rankIndex] ?? 80;
        const isChampion = user && rankIndex === 0; // rankIndex 0 = 1º

        return (
          <motion.div
            key={`slot-${slotIndex}-${user?.username ?? "empty"}`}
            className={`podium-slot ${isChampion ? "champion" : ""} ${user ? "" : "empty"}`}
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              delay: 0.12 * slotIndex,
              type: "spring",
              stiffness: 90,
              damping: 16,
            }}
          >
            <div
              className={`podium-pillar ${user ? "" : "empty"}`}
              style={{ height: `${pillarHeight}px` }}
              title={user ? `${user.username} — ${user.score}` : "Sin jugador"}
            >
              {user ? (
                <>
                  <div
                    className={`avatar-wrapper ${isChampion ? "champion-avatar" : ""}`}
                  >
                    <img
                      src={user.profilePicture}
                      alt={user.username}
                      className="podium-avatar"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/default-avatar.png";
                      }}
                    />
                    {isChampion && (
                      <div className="champion-badge" aria-hidden>
                        ★
                      </div>
                    )}
                  </div>

                  <div className="score-bubble">{user.score}</div>
                </>
              ) : (
                <div className="empty-pill-text">—</div>
              )}
            </div>

            <div className="name-label">
              {user ? user.username.toUpperCase() : "VACÍO"}
            </div>

            <div className="rank-label">{user ? `#${rankIndex + 1}` : ""}</div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
