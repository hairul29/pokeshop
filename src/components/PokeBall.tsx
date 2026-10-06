/** Original, simplified ball-shaped symbol used as a decorative brand element. */
export default function PokeBall({ size = 40, className }: { size?: number; className?: string }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="46" fill="#FFFFFF" stroke="#222222" strokeWidth="6" />
      <path d="M4 50a46 46 0 0 1 92 0z" fill="#EE1515" stroke="#222222" strokeWidth="6" strokeLinejoin="round" />
      <path d="M6 50h88" stroke="#222222" strokeWidth="8" />
      <circle cx="50" cy="50" r="14" fill="#FFFFFF" stroke="#222222" strokeWidth="7" />
      <circle cx="50" cy="50" r="5" fill="#FFCB05" stroke="#222222" strokeWidth="2" />
      <path d="M22 30a34 34 0 0 1 14-12" fill="none" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" opacity=".7" />
    </svg>
  );
}
