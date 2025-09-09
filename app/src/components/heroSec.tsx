"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export default function HeroSec(){
    const videoWrapRef = useRef<HTMLDivElement | null>(null);
    const textColRef = useRef<HTMLDivElement | null>(null);
    const [parallaxY, setParallaxY] = useState(0);
    const [activeIdx, setActiveIdx] = useState<number>(0);
    const [videoVisible, setVideoVisible] = useState<boolean>(true);
    const [pricingMode, setPricingMode] = useState<"subscription"|"lifetime">("subscription");

    useEffect(() => {
        const onScroll = () => {
            
            const y = window.scrollY * 0.08;
            setParallaxY(y);
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        if (!textColRef.current) return;
        const items = Array.from(textColRef.current.querySelectorAll<HTMLElement>(".reveal"));
        const io = new IntersectionObserver(
            entries => {
                entries.forEach(e => {
                    const idx = items.indexOf(e.target as HTMLElement);
                    if (e.isIntersecting) {
                        e.target.classList.add("opacity-100", "translate-y-0", "visible");
                        e.target.classList.remove("opacity-0", "translate-y-4", "invisible", "pointer-events-none");
                        if (idx !== -1 && idx !== activeIdx) {
                            setActiveIdx(idx);
                           
                            setVideoVisible(false);
                            setTimeout(() => setVideoVisible(true), 220);
                        }
                    } else {
                        e.target.classList.remove("opacity-100", "translate-y-0", "visible");
                        e.target.classList.add("opacity-0", "translate-y-4", "invisible", "pointer-events-none");
                    }
                });
            },
            { root: textColRef.current, threshold: 0.5 }
        );
        items.forEach(el => io.observe(el));
        return () => io.disconnect();
    }, [activeIdx]);

    return(
        <section className="relative mt-35 flex min-h-[80svh] flex-col items-center justify-center gap-6 text-center">
            <div id="home" className="scroll-mt-28 relative max-w-fit font-mono border border-blue-600 rounded-full px-4 py-1 text-xs text-blue-600 bg-blue-50 dark:bg-blue-950/30 drop-shadow-[0_6px_12px_rgba(37,99,235,0.25)]">
                100% Guaranteed - No LinkedIn Suspensions
            </div>
            <div className="text-4xl md:text-6xl font-bold leading-tight font-mono">
                <span className="bg-gradient-to-l from-blue-600 to-black dark:to-white bg-clip-text text-transparent">Effortless LinkedIn Outreach</span>
                <div className="bg-gradient-to-l from-blue-600 to-black dark:to-white bg-clip-text text-transparent">100% Safe and Scalable</div>
            </div>
            <div className="gap-1">
                <div className="font-mono"> Automate LinkedIn outreach securely, generate leads, and boost</div>
                <div className="font-mono">meetings without any risk of getting banned</div>
            </div>
            <Button asChild className="font-mono bg-blue-600 rounded-xs px-6 h-11 drop-shadow-lg text-shadow-lg">
                <a href="/login">Get Started Now</a>
            </Button>
            
            <div className="pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_center,white,transparent_80%)]">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.10)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.08)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:24px_24px]" />
            </div>
            <video 
                src="/linkedin-connect-demo.mp4"
                className="h-[460px] w-[840px] object-cover rounded-lg mb-[19px] border-[3px] border-lg drop-shadow-lg drop-shadow-gray-600 "
                playsInline
                autoPlay
                controls
                preload="metadata"
            />
            <div id="features" className="scroll-mt-28 font-mono text-5xl mt-10 bg-gradient-to-t from-blue-600 to-black dark:to-white bg-clip-text text-transparent">
                AI-Powered Security and Features - No One provides
            </div>
            <div className="font-mono">Discover how our AI-driven tools can tranform your productivity and streamline your day</div>

            
            <div className="mt-10 w-full max-w-6xl px-4 grid gap-8 items-start lg:grid-cols-2">
               
                <div ref={videoWrapRef} className={`order-3 lg:order-3 lg:sticky lg:top-24 transition-opacity duration-300 ${videoVisible ? 'opacity-100' : 'opacity-0'}`} style={{ transform: `translateY(${parallaxY}px)` }}>
                    <video
                        src="/linkedin-connect-demo.mp4"
                        className="w-full aspect-video rounded-lg border mb-2 bg-black object-cover drop-shadow-lg "
                        playsInline
                        autoPlay
                        muted
                        loop
                        preload="metadata"
                    />
                </div>
               
                <div ref={textColRef} className="order-2 lg:order-2 text-left overflow-y-auto h-[60svh] pr-2 snap-y snap-mandatory scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    <div className="reveal opacity-0 invisible pointer-events-none translate-y-4 transition-all duration-500 ease-out snap-start py-6 min-h-[60svh] flex flex-col justify-center">
                        <h2 className="text-2xl md:text-3xl font-semibold bg-gradient-to-t from-blue-600 to-black dark:to-white bg-clip-text text-transparent font-mono">Multiple Accounts - Dedicated IPs</h2>
                        <p className="text-sm md:text-base max-w-prose text-muted-foreground">
                            Manage multiple LinkedIn profiles securely, with each account assigned a unique IP and fingerprint to prevent detection by LinkedIn
                        </p>
                    </div>
                    <div className="reveal opacity-0 invisible pointer-events-none translate-y-4 transition-all duration-500 ease-out snap-start py-6 min-h-[60svh] flex flex-col justify-center">
                        <h2 className="text-2xl md:text-3xl font-semibold bg-gradient-to-t from-blue-600 to-black dark:to-white bg-clip-text text-transparent font-mono">Unlimited Campaigns & Lead Options</h2>
                        <p className="text-sm md:text-base max-w-prose text-muted-foreground">
                            Create unlimited campaigns and import leads in various ways: use our AI-powered Lead Finder, LinkedIn search, Sales Navigator, or export your own list. The possibilities are endless.
                        </p>
                    </div>
                    <div className="reveal opacity-0 invisible pointer-events-none translate-y-4 transition-all duration-500 ease-out snap-start py-6 min-h-[60svh] flex flex-col justify-center">
                        <h2 className="text-2xl md:text-3xl font-semibold bg-gradient-to-t from-blue-600 to-black dark:to-white bg-clip-text text-transparent font-mono">Unified Inbox - No Need to Open LinkedIn</h2>
                        <p className="text-sm md:text-base max-w-prose text-muted-foreground">
                            Manage and respond to all your LinkedIn messages, leads, and campaigns from one clean inbox without logging in to LinkedIn
                        </p>
                    </div>
                    <div className="reveal opacity-0 invisible pointer-events-none translate-y-4 transition-all duration-500 ease-out snap-start py-6 min-h-[60svh] flex flex-col justify-center">
                        <h2 className="text-2xl md:text-3xl font-semibold bg-gradient-to-t from-blue-600 to-black dark:to-white bg-clip-text text-transparent font-mono">Personalized, Automated Follow‑Ups</h2>
                        <p className="text-sm md:text-base max-w-prose text-muted-foreground">
                            Set smart, personalized follow-up sequences that hit when your leads are most likely to engage and respond
                        </p>
                    </div>
                </div>
            </div>
            <div className="mt-40">
                <a href="#feature" className=" font-mono inline-flex items-center justify-center rounded-full  border-2 border-gray px-4 py-1 text-sm font-medium hover:bg-accent transition-colors">
                    Learn How it Works
                </a>
            </div>
            <div className="mt-9 text-6xl font-bold  font-mono bg-gradient-to-l from-blue-600 to-black dark:to-white bg-clip-text text-transparent ">
            Simple & Easy Steps
            <div className="relative text-6xl  font-mono  bg-gradient-to-l from-blue-600 to-black dark:to-white bg-clip-text text-transparent">to Grow your Business</div>
            </div>
            <div className=" text-2xl font-mono">Connect multiple LinkedIn accounts,
                <div className="relative text-2xl font-mono"> add leads, and launch campaigns with ease</div>
           </div>
           <section className="mt-10 w-full max-w-6xl px-4 grid gap-8 md:gap-10 lg:gap-12 md:grid-cols-2 lg:grid-cols-3 text-left">
               <div className="relative rounded-2xl border bg-background/60 backdrop-blur-md shadow-xl p-6">
                 <span className="inline-flex items-center rounded-full bg-blue-500/10 text-blue-600 px-3 py-1 text-xs font-semibold">Step 1</span>
                   <h3 className="mt-3 text-xl font-mono font-bold bg-gradient-to-t from-blue-600 to-black dark:to-white bg-clip-text text-transparent">Connect Your LinkedIn</h3>
                   <p className="mt-2 text-sm text-muted-foreground">Securely link one or more LinkedIn profiles. Everything runs safely in the background—no shady workarounds.</p>
                <div className="relative mt-6 h-24 overflow-hidden top-15">
                  <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-2/3 -translate-y-2/3 flex items-center justify-center">
                    <div className="relative h-0 w-0">
                      <motion.div
                        className="absolute flex items-center gap-2 whitespace-nowrap rounded-xl border border-blue-600/10 bg-blue-600/40 dark:bg-blue-600/40 bg-opacity-40 dark:bg-opacity-40 px-3 py-2 shadow-lg"
                        initial={{ x: -140 }}
                        animate={{ x: [ -140, 0, 140, 0, -140 ] }}
                        transition={{ repeat: Infinity, duration: 4.2, ease: "easeInOut", delay: 0 }}
                      >
                        <div className="relative h-9 w-9 overflow-hidden rounded-full">
                          <img
                            alt="John Smith"
                            loading="lazy"
                            decoding="async"
                            sizes="36px"
                            srcSet="https://randomuser.me/api/portraits/men/2.jpg 1x"
                            src="https://randomuser.me/api/portraits/men/2.jpg"
                            className="absolute inset-0 h-full w-full object-cover text-transparent"
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">John Smith</span>
                          <span className="text-xs text-gray-600 dark:text-gray-200">Designer</span>
                        </div>
                      </motion.div>
                      <motion.div
                        className="absolute flex items-center gap-2 whitespace-nowrap rounded-xl border border-blue-600/10 bg-blue-600/40 dark:bg-blue-600/40 bg-opacity-40 dark:bg-opacity-40 px-3 py-2 shadow-lg"
                        initial={{ x: 0 }}
                        animate={{ x: [ 0, 140, 0, -140, 0 ] }}
                        transition={{ repeat: Infinity, duration: 4.2, ease: "easeInOut", delay: 0.35 }}
                      >
                        <div className="relative h-9 w-9 overflow-hidden rounded-full">
                          <img
                            alt="Mary Lee"
                            loading="lazy"
                            decoding="async"
                            sizes="36px"
                            srcSet="https://randomuser.me/api/portraits/women/44.jpg 1x"
                            src="https://randomuser.me/api/portraits/women/44.jpg"
                            className="absolute inset-0 h-full w-full object-cover text-transparent"
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">Mary Lee</span>
                          <span className="text-xs text-gray-600 dark:text-gray-200">Marketer</span>
                        </div>
                      </motion.div>
                      <motion.div
                        className="absolute  flex items-center gap-2 whitespace-nowrap rounded-xl border border-blue-600/10 bg-blue-600/40 dark:bg-blue-600/40 bg-opacity-40 dark:bg-opacity-40 px-3 py-2 shadow-lg"
                        initial={{ x: 140 }}
                        animate={{ x: [ 140, 0, -140, 0, 140 ] }}
                        transition={{ repeat: Infinity, duration: 4.2, ease: "easeInOut", delay: 0.7 }}>
                        <div className="relative h-9 w-9 overflow-hidden rounded-full">
                          <img
                            alt="Alex Doe"
                            loading="lazy"
                            decoding="async"
                            sizes="36px"
                            srcSet="https://randomuser.me/api/portraits/men/32.jpg 1x"
                            src="https://randomuser.me/api/portraits/men/32.jpg"
                            className="absolute inset-0 h-full w-full object-cover text-transparent"
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">Alex Doe</span>
                          <span className="text-xs text-gray-600 dark:text-gray-200">Sales</span>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            <div className="rounded-2xl border bg-background/60 backdrop:blur-md shadow-xl p-6">
                   <span className="inline-flex items-center rounded-full bg-blue-500/10 text-blue-600 px-3 py-1 text-xs font-semibold">Step 2</span>
                   <h3 className="mt-3 text-xl font-mono font-bold bg-gradient-to-t from-blue-600 to-black dark:to-white bg-clip-text text-transparent">Add Leads Your Way</h3>
                   <p className="mt-2 text-sm text-muted-foreground">Use Lead Finder to auto‑generate leads, drop a LinkedIn search URL or Sales Navigator—LinkBird does the heavy lifting.</p>
                   <video
                     src="/step2.mp4"
                     className="w-full h-60 aspect-video rounded-lg border mt-4 bg-black object-cover drop-shadow-lg"
                     playsInline
                     autoPlay
                     muted
                     loop
                     preload="metadata"
                   />
               </div>
               <div className="rounded-2xl border bg-background/60 backdrop:blur-md shadow-xl p-6">
                   <span className="inline-flex items-center rounded-full bg-blue-500/10 text-blue-600 px-3 py-1 text-xs font-semibold">Step 3</span>
                   <h3 className="mt-3 text-xl font-mono font-bold bg-gradient-to-t from-blue-600 to-black dark:to-white bg-clip-text text-transparent">Launch a Drip Campaign</h3>
                   <p className="mt-2 text-sm text-muted-foreground">Set up a personalized invite, welcome message, and smart follow‑ups. Every message can be tailored to your audience.</p>
                   <video
                     src="/step3.mp4"
                     className="w-full h-60 aspect-video rounded-lg border mt-4 bg-black object-cover drop-shadow-lg"
                     playsInline
                     autoPlay
                     muted
                     loop
                     preload="metadata"
                   />
               </div>
           </section>
         
          <section className="w-full mt-24 px-4 max-w-6xl text-left">
            <motion.h2
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              className="text-3xl md:text-4xl font-bold font-mono text-center mb-2"
            >
              <span className="bg-gradient-to-l from-blue-600 to-black dark:to-white bg-clip-text text-transparent">
                LinkBird - Your Best Choice
              </span>
            </motion.h2>
            <p className="text-center text-sm text-muted-foreground mb-6 font-mono">We compare our product with the best in the market — no competition.</p>

            <div className="rounded-2xl border bg-background/60 hover-elevate overflow-hidden mb-10">
              <div className="grid grid-cols-12 text-sm">
                
                <div className="col-span-3 p-3 font-semibold bg-gradient-to-r from-blue-600 to-white  dark:to-black ">Features</div>
                <div className="col-span-3 p-3 font-semibold border-t bg-gradient-to-r from-blue-600 to-white  dark:to-black ">
                  <img src="/linkbird-light-logo.svg" alt="LinkBird" className="inline h-4 align-middle mr-1" />
                </div>
                <div className="col-span-3 p-3 font-semibold border-l bg-gradient-to-r from-blue-600 to-white  dark:to-black">
                <img src="https://linkbird.ai/images/logo/dripify.svg" alt="LinkBird" className="inline h-4 align-middle mr-1" />
                </div>
                <div className="col-span-3 p-3 font-semibold border-l bg-gradient-to-r from-blue-600 to-white  dark:to-black ">
                <img src="https://linkbird.ai/images/logo/expandi.svg" alt="LinkBird" className="inline h-4 align-middle mr-1" />
                </div>

                {[
                  { label: "Price", a: "$19", b: "$59", c: "$99" },
                  { label: "AI Generated Leads", a: "Included (Auto or search)", b: "Manual Only", c: "Manual Only" },
                  { label: "Unlimited Campaigns & Leads", a: "Yes", b: "Limited by plan", c: "Limited tier" },
                  { label: "Instant Welcome Message", a: "With personalization and timing", b: "No", c: "No" },
                  { label: "Unified Dashboard", a: "One view for all accounts", b: "Account level only", c: "Some reporting features" },
                  { label: "Set‑up time", a: "Under 10 minutes", b: "Moderate", c: "Moderate" },
                  { label: "Safety & Compliant", a: "Unique IP for each account", b: "No unique IP—risk of blocking", c: "No IP—Browser emulation" },
                  { label: "Free Trial", a: "No credit card required", b: "Yes", c: "Yes" },
                  { label: "Best For", a: "Startup, agency & solo founders", b: "Individual users", c: "Enterprise teams" },
                ].map((row, i) => (
                  <motion.div key={row.label} className="contents" initial={{ opacity: 0, y: 6 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.03 }}>
                    <div className="col-span-3 p-3 border-t text-muted-foreground">{row.label}</div>
                    <div className="col-span-3 p-3 border-t border-l font-medium">{row.a}</div>
                    <div className="col-span-3 p-3 border-t border-l">{row.b}</div>
                    <div className="col-span-3 p-3 border-t border-l">{row.c}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
          
          <section id="pricing" className="scroll-mt-28 w-full mt-20 px-4 max-w-6xl mb-10">
            <motion.h2
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              className="text-4xl font-bold text-center font-mono"
            >
              <span className="bg-gradient-to-l from-blue-600 to-black dark:to-white bg-clip-text text-transparent">Pricing Plans</span>
            </motion.h2>
            <p className="text-center text-sm text-muted-foreground mt-2 mb-6 font-mono">Our plans are suitable for all types of individuals and businesses.</p>
            
            <div className="mb-6 flex items-center justify-center">
              <div className="relative inline-flex rounded-full bg-gradient-to-r from-black/20 to-black/10 dark:from-white/5 dark:to-white/10 p-1 border border-white/10 shadow-inner">
                <button
                  className={`px-5 py-2 text-sm md:text-[13px] rounded-full transition-all ${
                    pricingMode === "subscription"
                      ? "bg-blue-600 text-white shadow-[0_0_0_2px_#d1d5db_inset,0_6px_18px_rgba(37,99,235,0.45)]"
                      : "text-foreground/80 hover:bg-white/5"
                  }`}
                  onClick={() => setPricingMode("subscription")}
                >
                  Subscription
                </button>
                <button
                  className={`px-5 py-2 text-sm md:text-[13px] rounded-full transition-all ${
                    pricingMode === "lifetime"
                      ? "bg-blue-600 text-white shadow-[0_0_0_2px_#d1d5db_inset,0_6px_18px_rgba(37,99,235,0.45)]"
                      : "text-foreground/80 hover:bg-white/5"
                  }`}
                  onClick={() => setPricingMode("lifetime")}
                >
                  Lifetime
                </button>
                <span className="absolute -top-4 right-8 select-none rounded-md bg-blue-500 px-2 py-1 text-[10px] font-semibold text-white shadow">
                  Limited Time
                </span>
              </div>
            </div>

            {pricingMode === "subscription" ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[
                  { title: "Free Plan", price: "7 Days Free Trial", features: ["Manage up to 1 LinkedIn account","Send up to 200 connection requests"], cta: "Start 7 Days Free Trial" },
                  { title: "Basic Plan", price: "$19 / month", features: ["1 LinkedIn account","Unlimited connection requests","Automated follow‑ups","Lead scraping","1000 monthly credits"], cta: "Start 7 Days Free Trial" },
                  { title: "Professional Plan", price: "$49 / month", features: ["Up to 3 accounts","Unlimited connection requests","Advanced follow‑ups","In‑depth data scraping","5000 monthly credits"], cta: "Start 7 Days Free Trial" },
                  { title: "Business Plan", price: "$79 / month", features: ["Up to 5 accounts","Premium follow‑ups","Enterprise‑grade scraping","10000 monthly credits"], cta: "Start 7 Days Free Trial" },
                ].map((card, i) => (
                  <motion.div key={card.title} className="rounded-2xl border bg-background/60 p-5 hover-elevate" initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                    <div className="text-sm font-semibold text-muted-foreground">{card.title}</div>
                    <div className="mt-2 text-lg font-bold font-mono">{card.price}</div>
                    <div className="mt-4 space-y-2 text-sm">
                      {card.features.map((f) => (
                        <div key={f} className="flex items-start gap-2">
                          <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-blue-600" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                    <button className="mt-6 w-full rounded-md border px-3 py-2 text-sm hover:bg-accent">{card.cta}</button>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div className="mt-6 rounded-2xl border bg-background/60 p-6 hover-elevate" initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <div className=" mb-2  text-3xl font-bold font-mono hover:underline hover:decoration-blue-600">LifeTime Plan</div>
                    <div className="text-xs text-muted-foreground">Limited Time offer, only for first 1000 users</div>
                    <div className="mt-4 text-4xl font-extrabold font-mono">$199 <span className="text-base line-through opacity-60 align-super">$649</span></div>
                    <div className="text-xs text-muted-foreground">One‑time payment, lifetime access</div>
                    <button className="mt-5 rounded-md bg-blue-600 text-white px-4 py-2 text-sm w-full md:w-auto">Get Lifetime Access</button>
                  </div>
                  <div>
                    <div className=" relative mr-70 text-sm font-semibold mb-2 hover:underline hover:decoration-blue-600">Whats included</div>
                    <ul className="space-y-2 text-sm">
                      {[
                        "Manage up to 1 LinkedIn account",
                        "Send Unlimited connection requests",
                        "Automated follow‑up messaging",
                        "LinkedIn profile and lead data scraping",
                      ].map((it) => (
                        <li key={it} className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-600" />{it}</li>
                      ))}
                    </ul>
                    <div className="text-sm font-semibold mt-4 mb-2 mr-70 hover:underline hover:decoration-blue-600 ">Lifetime Perks</div>
                    <ul className="space-y-2 text-sm">
                      {[
                        "One‑time payment, no recurring fees",
                        "All future updates included",
                        "Priority support",
                      ].map((it) => (
                        <li key={it} className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-green-600" />{it}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}
          </section>
          
          <section className="w-full px-4 max-w-4xl mx-auto mt-12 mb-24 text-left">
            <motion.h3
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              className="text-3xl font-bold font-mono text-center mb-4"
            >
              <span className="bg-gradient-to-l from-blue-600 to-black dark:to-white bg-clip-text text-transparent">Frequently Asked Questions</span>
            </motion.h3>

            <div className="rounded-2xl border bg-background/60 hover-elevate divide-y">
              {[
                { q: "Is it safe for my LinkedIn account?", a: "Yes. Each account runs with a unique IP & fingerprint. We throttle actions to compliant limits." },
                { q: "Can I import my own leads?", a: "Absolutely. Upload CSVs, paste Sales Navigator links, or use our AI Lead Finder." },
                { q: "What is included in the free trial?", a: "Full access for 7 days. No credit card required. Cancel anytime within the trial." },
                { q: "Can I switch between plans later?", a: "Yes. You can upgrade/downgrade or move to the lifetime option anytime." },
              ].map((f, i) => (
                <details key={f.q} className="group">
                  <summary className="flex cursor-pointer items-center justify-between list-none p-4">
                    <span className="text-sm font-medium">{f.q}</span>
                    <span className="ml-4 inline-flex h-6 w-6 items-center justify-center rounded-md border text-xs transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="px-4 pb-4 text-sm text-muted-foreground"
                  >
                    {f.a}
                  </motion.div>
                </details>
              ))}
            </div>
          </section>
        </section>
    )
}