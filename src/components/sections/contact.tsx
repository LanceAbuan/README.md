"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Send, CheckCircle, AlertCircle } from "lucide-react";
import { getIcon } from "@/lib/icons";
import { contactLinks, contactEmail } from "@/data/contact";
import { useSectionReveal } from "@/components/section-reveal";

export function Contact() {
  const { ref, isInView } = useSectionReveal();

  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Something went wrong.");
      }

      setStatus("sent");
      form.reset();
      setTimeout(() => setStatus("idle"), 4000);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Failed to send.");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  return (
    <section id="contact" className="py-24 px-6" ref={ref}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-3">
            Contact
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Let&apos;s connect
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 max-w-lg leading-relaxed">
            Have a project in mind, want to collaborate, or just want to say hi?
            Drop me a message and I&apos;ll get back to you.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="space-y-4"
          >
            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-400">
                Find me on
              </h3>
              {contactLinks.map((link, i) => {
                const Icon = getIcon(link.icon);
                return (
                  <a
                    key={i}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl border border-neutral-200/50 dark:border-neutral-700/50 bg-white/30 dark:bg-neutral-900/30 hover:bg-white/60 dark:hover:bg-neutral-800/60 transition-colors group"
                  >
                    <Icon className="h-5 w-5 text-neutral-400 group-hover:text-foreground transition-colors" />
                    <span className="text-sm font-medium">{link.label}</span>
                    <svg
                      className="h-3.5 w-3.5 ml-auto text-neutral-300 dark:text-neutral-600 group-hover:text-foreground transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 17L17 7M17 7H7M17 7v10"
                      />
                    </svg>
                  </a>
                );
              })}
              <div className="pt-2">
                <a
                  href={`mailto:${contactEmail}`}
                  className="flex items-center gap-3 p-3 rounded-xl border border-neutral-200/50 dark:border-neutral-700/50 bg-white/30 dark:bg-neutral-900/30 hover:bg-white/60 dark:hover:bg-neutral-800/60 transition-colors group"
                >
                  <svg
                    className="h-5 w-5 text-neutral-400 group-hover:text-foreground transition-colors"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-sm font-medium">{contactEmail}</span>
                </a>
              </div>
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Your name"
                required
                disabled={status === "sending" || status === "sent"}
                className="bg-white/50 dark:bg-neutral-900/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                disabled={status === "sending" || status === "sent"}
                className="bg-white/50 dark:bg-neutral-900/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                name="message"
                placeholder="What&apos;s on your mind?"
                required
                rows={5}
                disabled={status === "sending" || status === "sent"}
                className="bg-white/50 dark:bg-neutral-900/50 resize-none"
              />
            </div>

            {status === "error" && (
              <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <Button
              type="submit"
              disabled={status === "sending" || status === "sent"}
              className="w-full rounded-full"
            >
              {status === "sending" ? (
                "Sending..."
              ) : status === "sent" ? (
                <>
                  <CheckCircle className="mr-2 h-3.5 w-3.5" /> Message sent
                </>
              ) : (
                <>
                  Send Message <Send className="ml-2 h-3.5 w-3.5" />
                </>
              )}
            </Button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
