import { useTranslation } from "react-i18next";
import { Button } from "../ui/Button";
import "./LanguageSelector.css";
const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="language-selector">
      <div className="language-buttons">
        <Button className={`lang-button`} onClick={() => changeLanguage("en")}>
          <p>ENGLISH</p>
        </Button>
        <Button className={`lang-button`} onClick={() => changeLanguage("es")}>
          <p>ESPAÑOL</p>
        </Button>
        <Button className={`lang-button`} onClick={() => changeLanguage("ca")}>
          <p>CATALÀ</p>
        </Button>
      </div>
    </div>
  );
};

export default LanguageSelector;
