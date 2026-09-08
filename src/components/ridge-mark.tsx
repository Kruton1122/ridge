export function RidgeMark({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      className={className}
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="7" fill="#07111C" />
      <rect x="1" y="1" width="30" height="30" rx="6" fill="none" stroke="#1C2C3C" />
      <path
        d="M4 23 L10 13 L15 19 L22 8 L28 23"
        fill="none"
        stroke="#E8B86D"
        strokeWidth="2.2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle cx="10" cy="13" r="1.15" fill="#E8EED4" />
      <circle cx="22" cy="8" r="1.15" fill="#7EC8C3" />
      <path d="M6 25.5 H12" stroke="#D4A27F" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M14 25.5 H19" stroke="#10A37F" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M21 25.5 H26" stroke="#4285F4" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
