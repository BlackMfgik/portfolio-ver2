interface BlackHoleTextProps {
  text: string;
  className?: string;
}

export default function BlackHoleText({ text, className = "" }: BlackHoleTextProps) {
  return (
    <span
      className={`black-hole-text ${className}`}
      aria-label={text}
      data-black-hole-text
    >
      {text}
    </span>
  );
}
