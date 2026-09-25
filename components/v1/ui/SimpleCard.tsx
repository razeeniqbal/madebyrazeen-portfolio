interface SimpleCardProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Ultra-lightweight card with CSS-only animations
 * Use this if you want maximum performance
 */
export default function SimpleCard({
  children,
  className = '',
}: SimpleCardProps) {
  return (
    <div
      className={`relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${className}`}
    >
      {children}
    </div>
  );
}
