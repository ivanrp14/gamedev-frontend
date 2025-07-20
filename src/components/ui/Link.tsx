import React from "react";

type LinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  target?: string;
  rel?: string;
};

export const Link: React.FC<LinkProps> = ({
  href,
  children,
  className = "",
  target,
  rel,
}) => (
  <a href={href} className={`link ${className}`} target={target} rel={rel}>
    {children}
  </a>
);
