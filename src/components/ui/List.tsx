import React from "react";

type ListProps = {
  children: React.ReactNode;
  ordered?: boolean;
  className?: string;
};

export const List: React.FC<ListProps> = ({
  children,
  ordered = false,
  className = "",
}) => {
  const ListTag = ordered ? "ol" : "ul";
  return <ListTag className={className}>{children}</ListTag>;
};
