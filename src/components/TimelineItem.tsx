import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";
import { MagicCard } from "./MagicCard";

interface TimelineItemProps {
  company: string;
  role: string;
  date: string;
  bullets: string[];
}

export const TimelineItem = ({ company, role, date, bullets }: TimelineItemProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <MagicCard className="rounded-2xl p-6" particleCount={10} glowColor="138, 43, 226">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-gradient-primary flex-shrink-0">
            <Briefcase className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-display font-bold mb-1">{role}</h3>
            <p className="text-primary mb-2">{company}</p>
            <p className="text-sm text-muted-foreground mb-4">{date}</p>
            <ul className="space-y-2">
              {bullets.map((bullet, index) => (
                <li key={index} className="text-sm text-foreground/80 flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </MagicCard>
    </motion.div>
  );
};
