"use client";

import { HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  hover?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className = "", title, subtitle, hover = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`bg-white rounded-xl shadow-sm border border-gray-100 ${
          hover ? "hover:shadow-md hover:border-gold-200 transition-all duration-200" : ""
        } ${className}`}
        {...props}
      >
        {(title || subtitle) && (
          <div className="px-5 py-4 border-b border-gray-100">
            {title && <h3 className="text-base font-semibold text-gray-900">{title}</h3>}
            {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
          </div>
        )}
        <div className="p-5">{children}</div>
      </div>
    );
  }
);

Card.displayName = "Card";

export default Card;
