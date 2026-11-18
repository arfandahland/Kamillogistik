import type { SVGProps } from "react";

const P: Record<string, string> = {
  home: "M3 11l9-8 9 8M5 10v10h14V10M10 20v-6h4v6",
  plus: "M12 5v14M5 12h14",
  swap: "M7 7h11l-3-3M17 17H6l3 3",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21c1-4 4-6 8-6s7 2 8 6",
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM21 21l-4.3-4.3",
  calc: "M6 3h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2ZM8 7h8M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01",
  truck: "M3 17h2m14 0h2M5 17V7h9v10M14 10h4l3 3v4M8 19.5a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6ZM17 19.5a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6Z",
  box: "M3 7l9-4 9 4-9 4-9-4ZM3 7v10l9 4 9-4V7M12 11v10",
  ship: "M3 17l2 3h14l2-3M5 17l1-6h12l1 6M9 11V6h6v5M12 3v3",
  shield: "M12 3 4 6v6c0 4.5 3.2 8 8 9 4.8-1 8-4.5 8-9V6l-8-3ZM9 12l2 2 4-4",
  phone: "M8 2.5h8a2 2 0 0 1 2 2v15a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-15a2 2 0 0 1 2-2ZM11 18h2",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 7v5l3 2",
  eye: "M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12ZM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  eyeoff: "M3 3l18 18M10.6 5.1A10 10 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3.2 4M6.5 6.6A16 16 0 0 0 2 12s3.6 7 10 7a9.7 9.7 0 0 0 4.4-1M9.9 9.9a3 3 0 0 0 4.2 4.2",
  lock: "M6 10h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2ZM8 10V7a4 4 0 0 1 8 0v3",
  mail: "M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2ZM4 8l8 5 8-5",
  arrow: "M5 12h14m-6-6 6 6-6 6",
  check: "M5 12.5l4.5 4.5L19 7.5",
  pin: "M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.800 12 21 12 21ZM12 12a2.500 2.500 0 1 0 0-5 2.500 2.500 0 0 0 0 5Z",
  out: "M9 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3M16 8l4 4-4 4M20 12H9",
  key: "M15 7a4 4 0 1 1-3.4 6.100L4 20.700V17h3v-2h2l2.600-2.600A4 4 0 0 1 15 7ZM16 9h.01",
  alert: "M12 3 2 20h20L12 3ZM12 10v4M12 17h.01",
  chat: "M4 5h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H9l-5 4V6a1 1 0 0 1 1-1Z",
  scale: "M12 3v18M5 7h14M5 7l-3 7a3 3 0 0 0 6 0L5 7ZM19 7l-3 7a3 3 0 0 0 6 0l-3-7Z",
  back: "M19 12H5m6-6-6 6 6 6",
  chart: "M3 3v18h18M7 15l4-4 3 3 5-6",
  list: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
  bolt: "M13 2 4 14h7l-1 8 9-12h-7l1-8Z",
  up: "M7 17 17 7M9 7h8v8",
  down: "M7 7l10 10M17 9v8H9",
};

export default function Icon({ name, size, ...rest }: { name: keyof typeof P | string; size?: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
      width={size} height={size} aria-hidden="true" {...rest}>
      <path d={P[name] ?? ""} />
    </svg>
  );
}
