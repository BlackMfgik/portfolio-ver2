interface MarqueeProps {
  items: string[];
  duration?: number;
  className?: string;
}

export default function Marquee({
  items,
  duration = 32,
  className = "",
}: MarqueeProps) {
  const doubled = [...items, ...items];

  return (
    <div
      className={`marquee ${className}`}
      style={{ ["--marquee-duration" as string]: `${duration}s` }}
    >
      <div className="marquee-track">
        {doubled.map((item, i) => (
          <span key={`${item}-${i}`} className="marquee-item">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
