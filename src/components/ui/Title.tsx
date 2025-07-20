import React from "react";

type TitleProps = {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  className?: string;
};

export const Title: React.FC<TitleProps> = ({
  level = 1,
  children,
  className = "",
}) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  return <Tag className={`title h${level} ${className}`}>{children}</Tag>;
};
