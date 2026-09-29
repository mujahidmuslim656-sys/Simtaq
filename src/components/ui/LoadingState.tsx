"use client";

interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({ message = "Memuat data..." }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      <p className="mt-4 text-sm text-gray-500">{message}</p>
    </div>
  );
}
