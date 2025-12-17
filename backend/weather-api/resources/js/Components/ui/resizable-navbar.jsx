"use client";
import { cn } from "@/lib/utils";
import { IconMenu2, IconX } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@inertiajs/react";
import React, { useState } from "react";

export const Navbar = ({ children, className }) => {
  return (
    <nav
      className={cn(
        "fixed inset-x-0 top-0 z-50 mx-auto w-full",
        className
      )}
    >
      {children}
    </nav>
  );
};

export const NavBody = ({ children, className, visible = true }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{
        opacity: visible ? 1 : 0,
        y: visible ? 0 : -10,
      }}
      transition={{ duration: 0.3 }}
      className={cn(
        "absolute inset-x-0 top-4 z-50 mx-auto hidden w-full max-w-7xl items-center justify-between rounded-full border border-white/10 bg-slate-900/80 px-4 py-2 shadow-lg backdrop-blur-xl md:flex",
        className
      )}
    >
      {children}
    </motion.div>
  );
};

export const NavItems = ({ items, className, onItemClick }) => {
  const [hovered, setHovered] = useState(null);

  return (
    <motion.div
      className={cn(
        "absolute inset-0 hidden flex-1 flex-row items-center justify-center space-x-2 text-sm font-medium text-neutral-300 transition duration-200 hover:text-white md:flex lg:space-x-2",
        className
      )}
    >
      {items.map((item, idx) => {
        const isInertiaLink = item.link.startsWith("/") || item.link.startsWith("http");
        
        return isInertiaLink ? (
          <Link
            key={`nav-item-${idx}`}
            href={item.link}
            onClick={onItemClick}
            onMouseEnter={() => setHovered(idx)}
            onMouseLeave={() => setHovered(null)}
            className="relative px-4 py-2 text-neutral-300 transition-colors hover:text-white"
          >
            {hovered === idx && (
              <motion.span
                layoutId="hovered-nav-item"
                className="absolute inset-0 rounded-full bg-white/10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
            <span className="relative z-10">{item.name}</span>
          </Link>
        ) : (
          <a
            key={`nav-item-${idx}`}
            href={item.link}
            onClick={onItemClick}
            onMouseEnter={() => setHovered(idx)}
            onMouseLeave={() => setHovered(null)}
            className="relative px-4 py-2 text-neutral-300 transition-colors hover:text-white"
          >
            {hovered === idx && (
              <motion.span
                layoutId="hovered-nav-item"
                className="absolute inset-0 rounded-full bg-white/10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
            <span className="relative z-10">{item.name}</span>
          </a>
        );
      })}
    </motion.div>
  );
};

export const MobileNav = ({ children, className }) => {
  return (
    <div className={cn("flex w-full flex-col md:hidden", className)}>
      {children}
    </div>
  );
};

export const MobileNavHeader = ({ children, className }) => {
  return (
    <div
      className={cn(
        "flex w-full items-center justify-between rounded-full border border-white/10 bg-slate-900/80 px-4 py-2 shadow-lg backdrop-blur-xl",
        className
      )}
    >
      {children}
    </div>
  );
};

export const MobileNavMenu = ({ children, className, isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "absolute inset-x-0 top-16 z-50 mt-2 flex flex-col gap-4 rounded-2xl border border-white/10 bg-slate-900/95 p-6 shadow-xl backdrop-blur-xl",
            className
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const MobileNavToggle = ({ isOpen, onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-full text-neutral-300 hover:bg-white/10",
        className
      )}
    >
      {isOpen ? (
        <IconX className="h-5 w-5" />
      ) : (
        <IconMenu2 className="h-5 w-5" />
      )}
    </button>
  );
};

export const NavbarLogo = ({ className }) => {
  return (
    <Link
      href="/"
      className={cn(
        "relative z-20 flex items-center space-x-2 text-sm font-bold text-white",
        className
      )}
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-700">
        <svg
          className="h-5 w-5 text-slate-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
          />
        </svg>
      </div>
      <span className="font-semibold">WeatherApp</span>
    </Link>
  );
};

export const NavbarButton = ({
  children,
  className,
  variant = "primary",
  href,
  onClick,
  ...props
}) => {
  const baseClasses =
    "relative z-10 flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition-colors";

  const variants = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700",
    secondary:
      "border border-slate-600 bg-slate-800 text-slate-300 hover:bg-slate-700",
    ghost:
      "text-slate-300 hover:bg-slate-700/50 hover:text-white",
  };

  const classes = cn(baseClasses, variants[variant], className);

  if (href) {
    return (
      <Link href={href} className={classes} onClick={onClick} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} onClick={onClick} {...props}>
      {children}
    </button>
  );
};
