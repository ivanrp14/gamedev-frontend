import { useState } from "react";
import { useTranslation } from "react-i18next";
import "./About.css";

function About() {
  const [activeSection, setActiveSection] = useState<"engine" | "videogames">(
    "engine"
  );

  const { t } = useTranslation();

  const toggleSection = () => {
    setActiveSection((prev) => (prev === "engine" ? "videogames" : "engine"));
  };

  const members = t(`about.${activeSection}_members`, {
    returnObjects: true,
  }) as string[];

  return (
    <div className="container">
      <h2>{t("about.title")}</h2>

      <section className="description">
        <p>{t("about.description")}</p>
      </section>

      <section className={`members-section ${activeSection}`}>
        <div className="switch-container">
          <button
            onClick={toggleSection}
            className="switch-button"
            data-alt-text={
              activeSection === "engine"
                ? t("about.button_videogames")
                : t("about.button_engine")
            }
          >
            {activeSection === "engine"
              ? t("about.button_engine")
              : t("about.button_videogames")}
          </button>
        </div>

        <h1>{t(`about.${activeSection}_title`)}</h1>

        <p className="description">{t(`about.${activeSection}_text`)}</p>

        <div className="members-grid">
          {members.map((member, idx) => (
            <div className="member-card" key={idx}>
              <img
                src={`https://via.placeholder.com/150?text=${member}`}
                alt={member}
                className="member-image"
              />
              <p className="member-name">{member}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default About;
