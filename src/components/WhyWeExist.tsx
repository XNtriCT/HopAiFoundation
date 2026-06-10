import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { SplitReveal } from './TextEffects/SplitReveal';
import { GradientFlowText } from './TextEffects/GradientFlowText';
import { AlertCircle, FileText, Database, PiggyBank, Users, GraduationCap } from 'lucide-react';
import { cn } from '../lib/utils';

gsap.registerPlugin(ScrollTrigger);

const CHALLENGES = [
   { icon: AlertCircle, label: 'Limited technical expertise' },
   { icon: FileText, label: 'Manual documentation' },
   { icon: Database, label: 'Resource constraints' },
   { icon: PiggyBank, label: 'Funding challenges' },
   { icon: Users, label: 'Communication inefficiencies' },
   { icon: GraduationCap, label: 'Lack of technology training' }
];

export function WhyWeExist() {
   const sectionRef = useRef<HTMLElement>(null);
   const cardsRef = useRef<HTMLDivElement[]>([]);

   useEffect(() => {
      if (!sectionRef.current) return;

      let ctx = gsap.context(() => {
         gsap.fromTo(cardsRef.current,
            {
               opacity: 0,
               y: 100,
               rotation: 15,
               scale: 0.8
            },
            {
               opacity: 1,
               y: 0,
               rotation: 0,
               scale: 1,
               duration: 0.8,
               stagger: 0.1,
               ease: "back.out(1.2)",
               scrollTrigger: {
                  trigger: ".cards-grid",
                  start: "top 80%"
               }
            }
         );
      }, sectionRef);

      return () => ctx.revert();
   }, []);

   return (
      <section id="about" ref={sectionRef} className="py-24 md:py-32 bg-transparent relative overflow-hidden">
         <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">

            <div className="mb-16 md:w-3/4">
               <h2 className="font-display font-bold text-3xl md:text-5xl text-foreground mb-6">
                  <SplitReveal text="The Social Sector Deserves Better Technology Access" />
               </h2>
               <p className="text-xl text-muted-foreground font-body max-w-2xl">
                  Across the world, thousands of nonprofit organizations continue to struggle with:
               </p>
            </div>

            <div className="cards-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
               {CHALLENGES.map((challenge, i) => {
                  const Icon = challenge.icon;
                  return (
                     <div
                        key={i}
                        ref={el => { if (el) cardsRef.current[i] = el; }}
                        className="interactive-card p-8 rounded-2xl group border border-border/40"
                     >
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 border border-primary/20 group-hover:bg-primary group-hover:text-white group-hover:scale-110 transition-all duration-300 text-primary shadow-sm">
                           <Icon className="group-hover:rotate-12 transition-transform duration-300" size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-foreground font-display group-hover:text-primary transition-colors">
                           {challenge.label}
                        </h3>
                     </div>
                  )
               })}
            </div>

            {/* Stats Scrubbers */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-y border-border/40 backdrop-blur-[4px]">
               <StatBlock endValue={150000} suffix="+" label="Nonprofits in India facing the digital divide" />
               <StatBlock endValue={73} suffix="%" label="of social sector orgs lack dedicated IT staff" />
               <StatBlock endValue={5} suffix="x" label="Faster impact reporting with AI tools" />
               <StatBlock endValue={100} suffix="%" label="Free & accessible programs for qualifying orgs" />
            </div>

         </div>
      </section>
   );
}

function StatBlock({ endValue, suffix, label }: { endValue: number, suffix: string, label: string }) {
   const numberRef = useRef<HTMLSpanElement>(null);

   useEffect(() => {
      if (!numberRef.current) return;

      let ctx = gsap.context(() => {
         gsap.fromTo(numberRef.current,
            { textContent: "0" },
            {
               textContent: endValue,
               duration: 2,
               ease: "power2.out",
               snap: { textContent: 1 },
               scrollTrigger: {
                  trigger: numberRef.current,
                  start: "top 85%",
                  once: true
               }
            }
         );
      });
      return () => ctx.revert();
   }, [endValue]);

   return (
      <div className="flex flex-col gap-2">
         <div className="font-display font-bold text-4xl md:text-5xl">
            <GradientFlowText>
               <span ref={numberRef}>0</span>{suffix}
            </GradientFlowText>
         </div>
         <p className="text-sm text-muted-foreground">{label}</p>
      </div>
   );
}
