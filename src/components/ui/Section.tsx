import React from "react";

type SectionProps = {
  id?: string;
  children: React.ReactNode;
  className?: string;
};

export const Section: React.FC<SectionProps> = ({
  id,
  children,
  className = "",
}) => (
  <section id={id} className={`section ${className}`}>
    {children}
  </section>
);
