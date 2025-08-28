import React, { useState, useEffect } from "react";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
  disabled?: boolean;
  variant?: "primary" | "secondary"; // 👈 nuevo
};

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = "button",
  className = "",
  disabled = false,
  variant = "primary", // 👈 valor por defecto
}) => {
  const [animatedText, setAnimatedText] = useState<string | null>(null);
  const [originalText, setOriginalText] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  const animateText = (text: string) => {
    if (isAnimating) return;

    setIsAnimating(true);
    setOriginalText(text);
    const textArray = text.split("");
    const frames = 15;
    const interval = 30;
    let frame = 0;

    const intervalId = setInterval(() => {
      const scrambled = textArray.map(() =>
        frame < frames ? chars[Math.floor(Math.random() * chars.length)] : ""
      );

      const finalText = scrambled.map((char, idx) =>
        frame < frames ? char : originalText![idx]
      );

      setAnimatedText(finalText.join(""));

      if (++frame > frames) {
        clearInterval(intervalId);
        setIsAnimating(false);
        setAnimatedText(originalText);
      }
    }, interval);
  };

  const handleMouseEnter = () => {
    if (originalText) {
      animateText(originalText);
    }
  };

  useEffect(() => {
    React.Children.forEach(children, (child) => {
      if (
        React.isValidElement(child) &&
        child.type === "p" &&
        typeof child.props.children === "string"
      ) {
        setOriginalText(child.props.children);
        setAnimatedText(child.props.children);
      }
    });
  }, [children]);

  return (
    <button
      type={type}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      className={`button ${variant} ${className}`} // 👈 añade la clase según variant
      disabled={disabled}
    >
      {React.Children.map(children, (child) => {
        if (
          React.isValidElement(child) &&
          child.type === "p" &&
          typeof child.props.children === "string" &&
          animatedText !== null
        ) {
          return <p className="animated-text">{animatedText}</p>;
        }
        return child;
      })}
    </button>
  );
};
