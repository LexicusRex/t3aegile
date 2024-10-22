import React from "react";

import { cn } from "@/lib/utils";

type Props = {
  isVisible: boolean;
  classNames?: string;
};

export const DropIndicator = (props: Props) => {
  const { isVisible, classNames = "" } = props;

  return (
    <div
      className={cn(
        `relative block h-[2px] w-full before:relative before:left-0 before:top-[-2px] before:block before:h-[6px] before:w-[6px] before:rounded after:relative after:left-[calc(100%-6px)] after:top-[-8px] after:block after:h-[6px] after:w-[6px] after:rounded`,
        {
          "bg-accent-foreground before:bg-accent-foreground after:bg-accent-foreground":
            isVisible,
        },
        classNames,
      )}
    />
  );
};
