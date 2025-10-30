import { Navbar } from "@/components/Navbar";
import { Hero3D } from "@/components/Hero3D";
import { SectionTitle } from "@/components/SectionTitle";
import { SkillCard } from "@/components/SkillCard";
import { TimelineItem } from "@/components/TimelineItem";
import { ProjectCard } from "@/components/ProjectCard";
import { CertificationBadge } from "@/components/CertificationBadge";
import { ContactForm } from "@/components/ContactForm";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { portfolioData } from "@/data/portfolio";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { SplashCursor } from "@/components/effects/SplashCursor";
import { LightRays } from "@/components/effects/LightRays";

const Index = () => {
  return (
    <div className="min-h-screen relative">
      <SplashCursor TRANSPARENT={true} SPLAT_FORCE={8000} />
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <LightRays raysOrigin="top-center" raysColor="#8a2be2" raysSpeed={1.5} pulsating={true} />
        <div className="absolute inset-0 z-0">
          <Hero3D />
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background z-10" />

        {/* Hero Content */}
        <div className="container mx-auto px-4 relative z-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full mb-6"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm">Available for opportunities</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">
              <span className="gradient-text">{portfolioData.name}</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              {portfolioData.title}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-primary hover:opacity-90 text-lg">
                {portfolioData.cta.primary}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg">
                {portfolioData.cta.secondary}
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
        >
          <div className="w-6 h-10 border-2 border-primary rounded-full flex justify-center pt-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-primary rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 container mx-auto px-4">
        <SectionTitle subtitle="Get to know me better">
          About Me
        </SectionTitle>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card rounded-2xl p-8 md:p-12 max-w-4xl mx-auto"
        >
          <p className="text-lg text-foreground/90 leading-relaxed">
            {portfolioData.summary}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
            <div className="text-center p-4 glass-card rounded-xl">
              <p className="text-3xl font-bold text-primary mb-1">4+</p>
              <p className="text-sm text-muted-foreground">Projects</p>
            </div>
            <div className="text-center p-4 glass-card rounded-xl">
              <p className="text-3xl font-bold text-secondary mb-1">3</p>
              <p className="text-sm text-muted-foreground">Certifications</p>
            </div>
            <div className="text-center p-4 glass-card rounded-xl col-span-2 md:col-span-1">
              <p className="text-3xl font-bold text-accent mb-1">2027</p>
              <p className="text-sm text-muted-foreground">Expected Graduation</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 container mx-auto px-4">
        <SectionTitle subtitle="Technologies and expertise I work with">
          Skills & Expertise
        </SectionTitle>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {Object.entries(portfolioData.skills).map(([category, skills], index) => (
            <SkillCard
              key={category}
              category={category}
              skills={skills}
              index={index}
            />
          ))}
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-20 container mx-auto px-4">
        <SectionTitle subtitle="My professional journey">
          Experience
        </SectionTitle>
        
        <div className="max-w-3xl mx-auto space-y-6">
          {portfolioData.experience.map((exp, index) => (
            <TimelineItem key={index} {...exp} />
          ))}
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 container mx-auto px-4">
        <SectionTitle subtitle="Featured work and case studies">
          Projects
        </SectionTitle>
        
        <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {portfolioData.projects.map((project, index) => (
            <ProjectCard key={index} {...project} index={index} />
          ))}
        </div>
      </section>

      {/* Certifications Section */}
      <section id="certifications" className="py-20 container mx-auto px-4">
        <SectionTitle subtitle="Professional credentials and achievements">
          Certifications
        </SectionTitle>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {portfolioData.certifications.map((cert, index) => (
            <CertificationBadge key={index} {...cert} index={index} />
          ))}
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-20 container mx-auto px-4">
        <SectionTitle subtitle="Milestones and recognition">
          Achievements
        </SectionTitle>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card rounded-2xl p-8 max-w-3xl mx-auto"
        >
          <ul className="space-y-4">
            {portfolioData.achievements.map((achievement, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3 text-lg"
              >
                <span className="text-2xl">{achievement.match(/[🏆💡📜]/)?.[0]}</span>
                <span className="text-foreground/90">
                  {achievement.replace(/[🏆💡📜]/g, "").trim()}
                </span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 container mx-auto px-4">
        <SectionTitle subtitle="Let's work together">
          Get In Touch
        </SectionTitle>
        
        <div className="max-w-5xl mx-auto">
          <ContactForm />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
