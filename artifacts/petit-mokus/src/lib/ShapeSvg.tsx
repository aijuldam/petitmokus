export type ShapeId = 'circle' | 'square' | 'triangle' | 'star';

export function ShapeSvg({
  id, hex, size = 44, outline = false,
}: {
  id: ShapeId; hex: string; size?: number; outline?: boolean;
}) {
  const fill = outline ? 'none' : hex;
  const stroke = outline ? hex : 'none';
  const sw = outline ? 3.5 : 0;
  const props = { fill, stroke, strokeWidth: sw };

  switch (id) {
    case 'circle':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48">
          <circle cx="24" cy="24" r="20" {...props} />
        </svg>
      );
    case 'square':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48">
          <rect x="4" y="4" width="40" height="40" rx="9" {...props} />
        </svg>
      );
    case 'triangle':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48">
          <polygon points="24,5 45,43 3,43" strokeLinejoin="round" {...props} />
        </svg>
      );
    case 'star':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48">
          <polygon
            points="24,4 29,18 44,18 32,28 37,42 24,33 11,42 16,28 4,18 19,18"
            strokeLinejoin="round"
            {...props}
          />
        </svg>
      );
    default:
      return null;
  }
}
