import { motion } from "framer-motion";
import { Badge } from "./ui/badge";
import { Code2, Layers, Bot, Globe, Users } from "lucide-react";

interface SkillCardProps {
  category: string;
  skills: string[];
  index: number;
}

const categoryIcons: Record<string, any> = {
  "Programming": Code2,
  "Frameworks": Layers,
  "AI & Automation": Bot,
  "Web Development": Globe,
  "Soft Skills": Users,
};

export const SkillCard = ({ category, skills, index }: SkillCardProps) => {
  const Icon = categoryIcons[category] || Code2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="glass-card rounded-2xl p-6 card-tilt hover-glow"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-gradient-primary">
          <Icon className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-xl font-display font-bold">{category}</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <Badge key={skill} variant="secondary" className="text-sm">
            {skill}
          </Badge>
        ))}
      </div>
    </motion.div>
  );
};
