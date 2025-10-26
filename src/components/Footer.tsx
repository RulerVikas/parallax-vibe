import { Github, Linkedin, Mail } from "lucide-react";
import { portfolioData } from "@/data/portfolio";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/50 mt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="text-sm text-muted-foreground">
              © {currentYear} {portfolioData.name}. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Built with React, TypeScript, and Three.js
            </p>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={`mailto:${portfolioData.contact.email}`}
              className="p-2 rounded-lg glass-card hover-glow"
              aria-label="Email"
            >
              <Mail className="w-5 h-5" />
            </a>
            <a
              href={portfolioData.contact.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg glass-card hover-glow"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href={portfolioData.contact.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg glass-card hover-glow"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
