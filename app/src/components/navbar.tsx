"use client";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import * as Tooltip from "@radix-ui/react-tooltip";

export default function    Navbar(){
    const { theme, setTheme } = useTheme();
    const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");
    const tooltipLabel = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";
    return<div className="nav-bar fixed top-10 left-1/2 transform -translate-x-1/2 z-50  h-[60px] w-[85%] md-[80%]  backdrop:blur-md border-[4px] border-black-200/80 dark:border-transparent shadow-lg bg-white/80 dark:bg-[#1E1E1E]/90 rounded-lg  " >
        <div className="relative max-w-7xl mx-auto h-full flex items-center justify-between px-4 md:px-6">
            <a className="flex items-center space-x-2 " href="/">
                <img className="h-[30px] w-[110px] md:h-[41px] md:w-[143px]" alt="LinkBird Logo" src="/linkbird-light-logo.svg" />
            </a>

            <div className="absolute left-1/2 -translate-x-1/2 hidden lg:flex items-center gap-[50px] text-gray-700 dark:text-white font-medium font-mono">
                <a className="hover:text-primary px-[6px] transition-colors duration-200" href="#home">Home</a>
                <a className="hover:text-primary px-[6px] transition-colors duration-200" href="#features">Feature</a>
                <a className="hover:text-primary px-[6px] transition-colors duration-200" href="#pricing">Pricing</a>
            </div>
        <div className="hidden lg:flex items-center gap-[25px]">
            <div className="relative p-1">
                <div className="inline-block" data-state="closed">
                    <Tooltip.Provider delayDuration={100}>
                        <Tooltip.Root>
                            <Tooltip.Trigger asChild>
                                <button onClick={toggleTheme} className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:text-accent-foreground text-xs h-8 w-8 rounded-full p-0 hover:bg-gray-100 dark:hover:bg-gray-800" aria-label="Toggle theme">
                                    {theme === "dark" ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" color="currentColor" className="h-5 w-5 text-muted-foreground">
                                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor"></path>
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" color="currentColor" className="h-5 w-5 text-gray-600">
                                            <circle cx="12" cy="12" r="4" stroke="currentColor"></circle>
                                            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="currentColor"></path>
                                        </svg>
                                    )}
                                </button>
                            </Tooltip.Trigger>
                            <Tooltip.Portal>
                                <Tooltip.Content sideOffset={8} className="rounded-md bg-blue-600 px-2 py-1 text-[11px] font-medium text-white shadow">
                                    {tooltipLabel}
                                    <Tooltip.Arrow className="fill-blue-600" />
                                </Tooltip.Content>
                            </Tooltip.Portal>
                        </Tooltip.Root>
                    </Tooltip.Provider>
                </div>
            </div>
            <Button asChild className="rounded-xs px-5 bg-blue-600 font-mono">
                <a  href="/login">Get Started</a>
            </Button>
        </div>
        </div>

    </div>
}