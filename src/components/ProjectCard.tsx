import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

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
      className="glass-card rounded-2xl p-6 card-tilt hover-glow flex flex-col h-full"
    >
      <div className="flex-1">
        <h3 className="text-2xl font-display font-bold mb-3">{title}</h3>
        
        <div className="mb-4">
          <p className="text-sm text-muted-foreground mb-2">Stack:</p>
          <div className="flex flex-wrap gap-2">
            {stack.map((tech) => (
              <Badge key={tech} variant="outline" className="text-xs">
                {tech}
              </Badge>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm text-muted-foreground mb-2">Features:</p>
          <ul className="space-y-1">
            {features.map((feature, i) => (
              <li key={i} className="text-sm text-foreground/80 flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => (
            <Badge key={tag} className="bg-gradient-primary text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex gap-3 mt-auto">
        {(links.live || links.demo) && (
          <Button size="sm" className="flex-1 bg-gradient-primary hover:opacity-90">
            <ExternalLink className="w-4 h-4 mr-2" />
            {links.live ? "Live" : "Demo"}
          </Button>
        )}
        {links.repo && (
          <Button size="sm" variant="outline" className="flex-1">
            <Github className="w-4 h-4 mr-2" />
            Repo
          </Button>
        )}
      </div>
    </motion.div>
  );
};
