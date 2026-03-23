import React from "react";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "destructive" | "outline";
}

export function Badge({ className = "", variant = "default", children, ...props }: BadgeProps) {
  const baseStyles = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2";
  
  const variants = {
    default: "border-transparent bg-blue-100 text-blue-900 hover:bg-blue-200 dark:bg-blue-800 dark:text-blue-100",
    success: "border-transparent bg-emerald-100 text-emerald-900 hover:bg-emerald-200 dark:bg-emerald-800 dark:text-emerald-100",
    warning: "border-transparent bg-yellow-100 text-yellow-900 hover:bg-yellow-200 dark:bg-yellow-800 dark:text-yellow-100",
    destructive: "border-transparent bg-red-100 text-red-900 hover:bg-red-200 dark:bg-red-800 dark:text-red-100",
    outline: "text-gray-950 dark:text-gray-50 border-gray-200 dark:border-gray-800",
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
}
