"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AuthButtonProps {
    onClick: () => void;
    icon: ReactNode;
    children: ReactNode;
    subtitle?: string;
    variant?: "white" | "glass" | "glass-subtle";
    className?: string;
    disabled?: boolean;
    providerIcon?: ReactNode;
}

export default function AuthButton({
    onClick,
    icon,
    children,
    subtitle,
    variant = "white",
    className,
    disabled,
    providerIcon
}: AuthButtonProps) {
    const variants = {
        white: "bg-white text-zinc-900 hover:bg-zinc-100 shadow-xl",
        glass: "bg-white/5 text-white border border-white/10 hover:bg-white/10 backdrop-blur-md",
        "glass-subtle": "bg-transparent text-zinc-400 border border-white/5 hover:border-white/10 hover:text-white"
    };

    return (
        <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={onClick}
            disabled={disabled}
            className={cn(
                "w-full flex items-center gap-4 p-4 rounded-full transition-all group relative overflow-hidden",
                variants[variant],
                disabled && "opacity-50 pointer-events-none",
                className
            )}
        >
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-black/5 group-hover:bg-black/10 transition-colors shrink-0">
                {icon}
            </div>

            <div className="flex-1 flex flex-col items-start text-left">
                <span className="text-sm font-bold tracking-tight">{children}</span>
                {subtitle && <span className="text-[10px] opacity-60 font-medium">{subtitle}</span>}
            </div>

            {providerIcon && (
                <div className="shrink-0 ml-2">
                    {providerIcon}
                </div>
            )}
        </motion.button>
    );
}
