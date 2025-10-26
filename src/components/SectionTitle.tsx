import { motion } from "framer-motion";
import { ReactNode } from "react";

interface SectionTitleProps {
  children: ReactNode;
  subtitle?: string;
  centered?: boolean;
}

export const SectionTitle = ({ children, subtitle, centered = true }: SectionTitleProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={centered ? "text-center mb-12" : "mb-12"}
    >
      <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
        <span className="gradient-text">{children}</span>
      </h2>
      {subtitle && (
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
};
