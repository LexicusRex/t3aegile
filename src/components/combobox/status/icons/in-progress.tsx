import type { SVGProps } from "react";

import type { SVGRProps } from "./types";

export const InProgressIcon = ({
  title,
  titleId,
  desc,
  descId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    aria-label="In Progress Status"
    aria-labelledby={titleId}
    aria-describedby={descId}
    {...props}
  >
    <circle
      cx="7"
      cy="7"
      r="6"
      fill="none"
      stroke="#f2be00"
      strokeWidth="2"
      strokeDasharray="3.14 0"
      strokeDashoffset="-0.7"
    ></circle>
    <circle
      cx="7"
      cy="7"
      r="2"
      fill="none"
      stroke="#f2be00"
      strokeWidth="4"
      strokeDasharray="6.2517693806436885 100"
      strokeDashoffset="0"
      transform="rotate(-90 7 7)"
    ></circle>
  </svg>
);
