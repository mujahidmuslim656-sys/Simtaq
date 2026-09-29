"use client";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  className?: string;
}

export default function Logo({ size = "md", showText = true, className = "" }: LogoProps) {
  const sizes = {
    sm: { icon: "w-8 h-8", text: "text-lg", iconInner: "w-4 h-4" },
    md: { icon: "w-10 h-10", text: "text-xl", iconInner: "w-5 h-5" },
    lg: { icon: "w-14 h-14", text: "text-2xl", iconInner: "w-7 h-7" },
    xl: { icon: "w-20 h-20", text: "text-3xl", iconInner: "w-10 h-10" },
  };

  const s = sizes[size];

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className={`${s.icon} bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl flex items-center justify-center shadow-md`}>
        <svg
          className={s.iconInner}
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.32.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.32.477-4.5 1.253" />
        </svg>
      </div>
      {showText && (
        <span className={`${s.text} font-bold text-gray-900`}>
          Sim<span className="text-gold-500">taq</span>
        </span>
      )}
    </div>
  );
}
