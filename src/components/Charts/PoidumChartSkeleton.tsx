// PodiumChartSkeleton.tsx
import { motion } from "framer-motion";

const SLOT_ORDER = [3, 1, 0, 2, 4];
const HEIGHT_BY_RANK: Record<number, number> = {
  0: 220,
  1: 170,
  2: 150,
  3: 110,
  4: 90,
};

export default function PodiumChartSkeleton() {
  return (
    <motion.div
      className="podium-container"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      aria-label="Cargando podio..."
    >
      {SLOT_ORDER.map((rankIndex, slotIndex) => {
        const pillarHeight = HEIGHT_BY_RANK[rankIndex] ?? 80;
        const isChampion = rankIndex === 0;

        return (
          <motion.div
            key={`slot-skeleton-${slotIndex}`}
            className={`podium-slot ${isChampion ? "champion" : ""} empty`}
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
              className={`podium-pillar empty skeleton`}
              style={{ height: `${pillarHeight}px` }}
            >
              <div
                className={`avatar-wrapper ${isChampion ? "champion-avatar" : ""}`}
              >
                <div
                  className="podium-avatar skeleton-circle"
                  style={{
                    width: isChampion ? "98px" : "72px",
                    height: isChampion ? "98px" : "72px",
                  }}
                />
              </div>
              <div
                className="score-bubble skeleton-box"
                style={{ width: "40px" }}
              />
            </div>

            <div className="name-label skeleton-box" style={{ width: "60%" }} />
            <div className="rank-label skeleton-box" style={{ width: "40%" }} />
          </motion.div>
        );
      })}
    </motion.div>
  );
}
