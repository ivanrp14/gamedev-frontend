import React, { useState, useEffect } from "react";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
  disabled?: boolean;
};

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = "button",
  className = "",
  disabled = false,
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
      const scrambled = textArray.map((char, idx) =>
        frame < frames ? chars[Math.floor(Math.random() * chars.length)] : char
      );
      setAnimatedText(scrambled.join(""));

      if (++frame > frames) {
        clearInterval(intervalId);
        setIsAnimating(false);
        setAnimatedText(text);
      }
    }, interval);
  };

  const handleMouseEnter = () => {
    if (originalText) {
      animateText(originalText);
    }
  };

  // This will ensure text is updated when children change (like "Login" to "Go to Dashboard")
  useEffect(() => {
    React.Children.forEach(children, (child) => {
      if (typeof child === "string") {
        setAnimatedText(child);
        setOriginalText(child);
      }
    });
  }, [children]);

  return (
    <button
      type={type}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      className={`button ${className}`}
      disabled={disabled}
    >
      {React.Children.map(children, (child) => {
        if (typeof child === "string" && animatedText !== null) {
          return <span className="animated-text">{animatedText}</span>;
        }
        return child;
      })}
    </button>
  );
};
