import type React from "react";

export const PastelIcon = (props: React.ComponentPropsWithoutRef<"svg">) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <title>Pastel</title>

      <path d="M3 15C3 9 8 4 18 4L21 7C21 17 16 21 7 21Z" />

      <path d="M5 18L7 16" />
      <path d="M9 19L11 17" />
      <path d="M13 19L15 17" />
      <path d="M17 18L19 16" />
    </svg>
  );
};
