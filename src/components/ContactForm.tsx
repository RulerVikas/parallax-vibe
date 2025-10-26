import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mail, MapPin, Phone } from "lucide-react";
import { portfolioData } from "@/data/portfolio";

export const ContactForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "Message sent! 🎉",
      description: "Thanks for reaching out. I'll get back to you soon!",
    });

    setFormData({ name: "", email: "", message: "" });
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Contact Info */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div>
          <h3 className="text-2xl font-display font-bold mb-4">Get In Touch</h3>
          <p className="text-muted-foreground mb-8">
            Feel free to reach out for collaborations, opportunities, or just a friendly chat!
          </p>
        </div>

        <div className="space-y-4">
          <a
            href={`mailto:${portfolioData.contact.email}`}
            className="flex items-center gap-3 glass-card rounded-xl p-4 hover-glow"
          >
            <div className="p-2 rounded-lg bg-gradient-primary">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{portfolioData.contact.email}</p>
            </div>
          </a>

          <a
            href={`tel:${portfolioData.contact.phone}`}
            className="flex items-center gap-3 glass-card rounded-xl p-4 hover-glow"
          >
            <div className="p-2 rounded-lg bg-gradient-secondary">
              <Phone className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium">{portfolioData.contact.phone}</p>
            </div>
          </a>

          <div className="flex items-center gap-3 glass-card rounded-xl p-4">
            <div className="p-2 rounded-lg bg-gradient-accent">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="font-medium">{portfolioData.contact.location}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Contact Form */}
      <motion.form
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        onSubmit={handleSubmit}
        className="glass-card rounded-2xl p-6 space-y-4"
      >
        <div>
          <label htmlFor="name" className="text-sm font-medium mb-2 block">
            Name
          </label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Your name"
          />
        </div>

        <div>
          <label htmlFor="email" className="text-sm font-medium mb-2 block">
            Email
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="your.email@example.com"
          />
        </div>

        <div>
          <label htmlFor="message" className="text-sm font-medium mb-2 block">
            Message
          </label>
          <Textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            placeholder="Your message..."
            rows={5}
          />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-primary hover:opacity-90"
        >
          {isSubmitting ? "Sending..." : "Send Message"}
        </Button>
      </motion.form>
    </div>
  );
};
