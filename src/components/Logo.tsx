import PokeBall from './PokeBall';

/** POKESHOP wordmark: yellow letters, blue + dark outline, red underline, ball symbol. Works on light and dark. */
export default function Logo({ height = 40 }: { height?: number }) {
  const text = { fontFamily: 'Orbitron, sans-serif', fontWeight: 900, fontSize: 36 } as const;
  return (
    <span className="logo" aria-label="POKESHOP">
      <PokeBall size={height} className="logo__ball" />
      <svg viewBox="0 0 250 66" height={height} role="img" aria-hidden="true">
        <defs>
          <linearGradient id="logo-yellow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FFE45E" />
            <stop offset="1" stopColor="#FFCB05" />
          </linearGradient>
        </defs>
        <text x="14" y="45" textLength="224" lengthAdjust="spacingAndGlyphs" style={text}
          fill="#222222" stroke="#222222" strokeWidth="12" strokeLinejoin="round" transform="translate(3 4)">POKESHOP</text>
        <text x="14" y="45" textLength="224" lengthAdjust="spacingAndGlyphs" style={text}
          fill="#3B4CCA" stroke="#222222" strokeWidth="11" strokeLinejoin="round">POKESHOP</text>
        <text x="14" y="45" textLength="224" lengthAdjust="spacingAndGlyphs" style={text}
          fill="#3B4CCA" stroke="#3B4CCA" strokeWidth="7" strokeLinejoin="round">POKESHOP</text>
        <text x="14" y="45" textLength="224" lengthAdjust="spacingAndGlyphs" style={text} fill="url(#logo-yellow)">POKESHOP</text>
        <rect x="16" y="58" width="220" height="5" rx="2.5" fill="#EE1515" stroke="#222222" strokeWidth="1.5" />
      </svg>
    </span>
  );
}
