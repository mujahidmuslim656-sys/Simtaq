"use client";

import { HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className = "", title, subtitle, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`bg-white rounded-xl shadow-sm border border-gray-200 ${className}`}
        {...props}
      >
        {(title || subtitle) && (
          <div className="px-6 py-4 border-b border-gray-200">
            {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
            {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    );
  }
);

Card.displayName = "Card";

export default Card;
