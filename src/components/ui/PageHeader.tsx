"use client";

import IslamicPattern from "@/components/IslamicPattern";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export default function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="relative bg-gradient-to-r from-primary-700 to-primary-800 rounded-xl p-6 mb-6 overflow-hidden">
      <IslamicPattern variant="light" />
      <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">{title}</h1>
          {subtitle && <p className="text-primary-200 text-sm mt-1">{subtitle}</p>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </div>
  );
}
