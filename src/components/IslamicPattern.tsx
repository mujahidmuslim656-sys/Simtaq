"use client";

interface IslamicPatternProps {
  variant?: "light" | "dark";
  className?: string;
}

export default function IslamicPattern({ variant = "light", className = "" }: IslamicPatternProps) {
  const patternClass = variant === "light" ? "pattern-islamic" : "pattern-islamic-dark";

  return (
    <div
      className={`absolute inset-0 ${patternClass} pointer-events-none ${className}`}
      aria-hidden="true"
    />
  );
}
