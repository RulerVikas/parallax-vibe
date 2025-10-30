import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { MagicCard } from "./MagicCard";
import { ShinyText } from "./effects/ShinyText";

interface ProjectCardProps {
  title: string;
  stack: string[];
  features: string[];
  links: { live?: string; repo?: string; demo?: string };
  tags: string[];
  index: number;
}

export const ProjectCard = ({ title, stack, features, links, tags, index }: ProjectCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <MagicCard className="rounded-2xl p-6 flex flex-col h-full">
        <div className="flex-1">
          <h3 className="text-2xl font-display font-bold mb-3">{title}</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {stack.map((tech) => (
              <Badge key={tech} variant="outline" className="text-xs">{tech}</Badge>
            ))}
          </div>
          <ul className="space-y-2 mb-4">
            {features.map((feature, i) => (
              <li key={i} className="text-sm text-foreground/80 flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag} className="bg-gradient-primary text-xs">{tag}</Badge>
            ))}
          </div>
        </div>
        <div className="flex gap-3 mt-4">
          {(links.live || links.demo) && (
            <Button size="sm" className="flex-1 bg-gradient-primary hover:opacity-90" asChild>
              <a href={links.live || links.demo} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                <ShinyText text={links.live ? "Live" : "Demo"} speed={3} />
              </a>
            </Button>
          )}
          {links.repo && (
            <Button size="sm" variant="outline" className="flex-1" asChild>
              <a href={links.repo} target="_blank" rel="noopener noreferrer">
                <Github className="w-4 h-4 mr-2" />
                <ShinyText text="Repo" speed={3} />
              </a>
            </Button>
          )}
        </div>
      </MagicCard>
    </motion.div>
  );
};
