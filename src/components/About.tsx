import React from 'react';
import { GradientFlowText } from './TextEffects/GradientFlowText';
import { Heart, ShieldCheck, Globe, Users, Handshake, Zap } from 'lucide-react';
import { motion } from 'motion/react';

const VALUES = [
   { icon: Heart, label: 'Human-Centered Innovation' },
   { icon: ShieldCheck, label: 'Ethical AI' },
   { icon: Globe, label: 'Accessibility' },
   { icon: Users, label: 'Inclusion' },
   { icon: Handshake, label: 'Collaboration' },
   { icon: Zap, label: 'Continuous Learning' }
];

export function About() {
  return (
    <section id="about-values" className="py-24 md:py-32 bg-transparent relative overflow-hidden">
        {/* Subtle background image */}
      <div className="absolute inset-0 z-0 opacity-5">
         <img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&q=80" alt="background" className="w-full h-full object-cover" />
         <div className="absolute inset-0 bg-background/60 mix-blend-multiply" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
         <div className="mb-24 text-center max-w-4xl mx-auto">
             <h2 className="font-display font-extrabold text-3xl md:text-5xl lg:text-6xl leading-tight text-foreground mb-8">
               <GradientFlowText>
                  A Future Where Technology Strengthens Every Social Impact Initiative
               </GradientFlowText>
             </h2>
         </div>

         <div className="flex flex-wrap justify-center items-center gap-4 mb-32">
            {VALUES.map((v, i) => {
               const Icon = v.icon;
               return (
                  <motion.div
                     key={i}
                     initial={{ opacity: 0, y: 30 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     transition={{ duration: 0.6, delay: i * 0.1, type: "spring", bounce: 0.4 }}
                     className="interactive-card flex items-center justify-center gap-3 px-6 py-4 rounded-full border border-border/40 bg-card/80 backdrop-blur-xl hover:scale-105 duration-300 cursor-default group"
                  >
                     <Icon className="text-primary group-hover:rotate-12 transition-transform duration-300" size={20} />
                     <span className="font-medium text-foreground">{v.label}</span>
                  </motion.div>
               )
            })}
         </div>

         {/* Legal Block */}
         <div className="max-w-3xl mx-auto border border-border rounded-2xl p-8 md:p-12 text-center bg-card/50 backdrop-blur-sm relative overflow-hidden">
             <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
             <p className="text-muted-foreground font-mono text-sm leading-relaxed">
                 <strong className="text-foreground">Organization:</strong> HOP AI Foundation<br/>
                 <strong className="text-foreground">Type:</strong> Section 8 Non-Profit | Kerala, India<br/>
                 <strong className="text-foreground">CIN:</strong> U85500KL2026NPL101861<br/>
                 <strong className="text-foreground">License Number:</strong> 182077
             </p>
         </div>
      </div>
    </section>
  );
}
