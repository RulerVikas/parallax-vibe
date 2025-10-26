import { motion } from "framer-motion";
import { Award } from "lucide-react";

interface CertificationBadgeProps {
  name: string;
  date: string;
  index: number;
}

export const CertificationBadge = ({ name, date, index }: CertificationBadgeProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ scale: 1.05 }}
      className="glass-card rounded-xl p-4 hover-glow flex items-center gap-3"
    >
      <div className="p-2 rounded-lg bg-gradient-primary flex-shrink-0">
        <Award className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm mb-1 truncate">{name}</p>
        <p className="text-xs text-muted-foreground">{date}</p>
      </div>
    </motion.div>
  );
};
