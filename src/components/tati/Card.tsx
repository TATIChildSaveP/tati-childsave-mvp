import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Card({
  children,
  className,
  tone = "surface",
}: {
  children: ReactNode;
  className?: string;
  tone?: "surface" | "muted" | "primary";
}) {
  return (
    <div
      className={cn(
        "rounded-3xl p-5 shadow-card",
        tone === "surface" && "bg-card text-card-foreground",
        tone === "muted" && "bg-secondary text-secondary-foreground shadow-none",
        tone === "primary" && "bg-primary text-primary-foreground",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardTitle({ children, className }: { children: ReactNode; className?: string }) {
  return <h2 className={cn("text-lg font-extrabold", className)}>{children}</h2>;
}

export function CardNote({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("mt-1 text-base text-muted-foreground", className)}>{children}</p>;
}
