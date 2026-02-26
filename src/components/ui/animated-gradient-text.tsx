import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AnimatedGradientTextProps {
    children: ReactNode;
    className?: string;
    speed?: number;
    colorFrom?: string;
    colorTo?: string;
}

export function AnimatedGradientText({
    children,
    className,
    speed = 1,
    colorFrom = "#ffaa40",
    colorTo = "#9c40ff",
}: AnimatedGradientTextProps) {
    return (
        <span
            className={cn(
                "inline-block text-transparent bg-clip-text",
                className
            )}
            style={{
                backgroundImage: `linear-gradient(to right, ${colorFrom}, ${colorTo}, ${colorFrom})`,
                backgroundSize: "200% auto",
                animation: `gradient-shift ${speed}s linear infinite`,
            }}
        >
            <style dangerouslySetInnerHTML={{
                __html: `
          @keyframes gradient-shift {
            0% { background-position: 0% center; }
            100% { background-position: -200% center; }
          }
        `
            }} />
            {children}
        </span>
    );
}
