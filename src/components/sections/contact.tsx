"use client";

import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Send, CheckCircle, AlertCircle } from "lucide-react";
import { getIcon } from "@/lib/icons";
import { useSectionReveal } from "@/components/section-reveal";
import { useTheme } from "next-themes";
import { contactLinks, contactEmail } from "@/data/contact";
import { cn } from "@/lib/utils";

type FormStatus = "idle" | "sending" | "sent" | "error";

export function Contact() {
  const { ref, isInView } = useSectionReveal();
  const { theme } = useTheme();
  const isTerminal = theme === "terminal";
  const isNewspaper = theme === "newspaper";
  const isCasino = theme === "casino";

  const [status, setStatus] = useState<FormStatus>("idle");
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
          {isTerminal ? (
            <div>
              <p className="text-xs font-mono text-[#00aa30] mb-2 tracking-wider" data-terminal-prompt>
                contact
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold font-mono text-[#00ff41] terminal-glow uppercase tracking-wider">
                Establish.Link
              </h2>
              <p className="text-sm text-[#00aa30] font-mono mt-4 max-w-lg">
                Have a project in mind, want to collaborate, or just want to say hi?
                {"\n"}Drop me a message and I&apos;ll get back to you.
              </p>
            </div>
          ) : isCasino ? (
            <div>
              <p className="casino-label mb-3">
                CONTACT
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold font-serif casino-neon tracking-tight mb-4">
                Place Your Hand
              </h2>
              <div className="casino-divider mb-4">
                <span>♦</span>
              </div>
              <p className="text-[#fef3c7] font-serif max-w-lg leading-relaxed">
                Have a project in mind, want to collaborate, or just want to say hi?
                Drop me a message and I&apos;ll get back to you.
              </p>
            </div>
          ) : isNewspaper ? (
            <div>
              <p className="text-xs font-serif tracking-[0.2em] text-[#7a6b5a] mb-1 uppercase" data-newspaper-section>
                Contact
              </p>
              <hr className="newspaper-rule" />
              <h2 className="text-3xl sm:text-4xl font-bold font-serif text-[#1a1208] mt-4">
                Let&apos;s Connect
              </h2>
              <p className="text-[#3d2b1f] font-serif mt-4 max-w-lg leading-relaxed">
                Have a project in mind, want to collaborate, or just want to say hi?
                Drop me a message and I&apos;ll get back to you.
              </p>
            </div>
          ) : (
            <>
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
            </>
          )}
        </motion.div>

        <div className={cn(
          "grid md:grid-cols-2 gap-8",
          isNewspaper && "md:grid-cols-1",
          isCasino && "md:grid-cols-1",
        )}>
          {/* Social links sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="space-y-4"
          >
            <div className="space-y-3">
              <h3
                className={cn(
                  "text-sm font-semibold uppercase tracking-wider text-neutral-400",
                  isTerminal && "font-mono text-[#00aa30]",
                  isCasino && "font-serif text-[#dc2626] tracking-[0.2em]",
                  isNewspaper && "font-serif text-[#7a6b5a] tracking-[0.15em]",
                )}
              >
                {isTerminal ? "$ find --links" : isCasino ? "Connect" : isNewspaper ? "Find me on" : "Find me on"}
              </h3>
              {contactLinks.map((link, i) => {
                const Icon = getIcon(link.icon);
                return (
                  <a
                    key={i}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl border transition-colors group",
                      isTerminal
                        ? "terminal-card rounded-none text-[#00ff41]"
                        : isCasino
                          ? "casino-card rounded-lg border-[#d4af3715] text-[#fef3c7] hover:bg-[#2a0505]/80"
                          : isNewspaper
                            ? "newspaper-card rounded-none text-[#1a1208]"
                            : "border-neutral-200/50 dark:border-neutral-700/50 bg-white/30 dark:bg-neutral-900/30 hover:bg-white/60 dark:hover:bg-neutral-800/60",
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-5 w-5 transition-colors",
                        isTerminal && "text-[#00ff41]",
                        isCasino && "text-[#dc2626] group-hover:text-white",
                        isNewspaper && "text-[#5c2e0e] group-hover:text-[#1a1208]",
                        !isTerminal && !isCasino && !isNewspaper && "text-neutral-400 group-hover:text-foreground",
                      )}
                    />
                    <span
                      className={cn(
                        "text-sm font-medium",
                        isTerminal && "font-mono",
                        isCasino && "font-serif",
                        isNewspaper && "font-serif",
                      )}
                    >
                      {link.label}
                    </span>
                    <svg
                      className={cn(
                        "h-3.5 w-3.5 ml-auto transition-colors",
                        isTerminal && "text-[#00ff4140] group-hover:text-[#00ff41]",
                        isCasino && "text-[#d4af3730] group-hover:text-[#dc2626]",
                        isNewspaper && "text-[#c4b59e] group-hover:text-[#1a1208]",
                        !isTerminal && !isCasino && !isNewspaper && "text-neutral-300 dark:text-neutral-600 group-hover:text-foreground",
                      )}
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
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-xl border transition-colors group",
                    isTerminal
                      ? "terminal-card rounded-none text-[#00ff41]"
                      : isCasino
                        ? "casino-card rounded-lg border-[#d4af3715] text-[#fef3c7] hover:bg-[#2a0505]/80"
                        : isNewspaper
                          ? "newspaper-card rounded-none text-[#1a1208]"
                          : "border-neutral-200/50 dark:border-neutral-700/50 bg-white/30 dark:bg-neutral-900/30 hover:bg-white/60 dark:hover:bg-neutral-800/60",
                  )}
                >
                  <svg
                    className={cn(
                      "h-5 w-5 transition-colors",
                      isTerminal && "text-[#00ff41]",
                      isCasino && "text-[#dc2626] group-hover:text-white",
                      isNewspaper && "text-[#5c2e0e] group-hover:text-[#1a1208]",
                      !isTerminal && !isCasino && !isNewspaper && "text-neutral-400 group-hover:text-foreground",
                    )}
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
                  <span
                    className={cn(
                      "text-sm font-medium",
                      isTerminal && "font-mono",
                      isCasino && "font-serif",
                      isNewspaper && "font-serif",
                    )}
                  >
                    {contactEmail}
                  </span>
                </a>
              </div>
            </div>
          </motion.div>

          {/* Contact form */}
          <motion.form
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className={cn(
                  isTerminal && "font-mono text-[#00aa30]",
                  isCasino && "font-serif text-[#dc2626] tracking-wider",
                  isNewspaper && "font-serif text-[#5c2e0e]",
                )}
              >
                {isTerminal ? "> name:" : isCasino ? "Your Name" : "Name"}
              </Label>
              <Input
                id="name"
                name="name"
                placeholder={isTerminal ? "enter_name..." : "Your name"}
                required
                disabled={status === "sending" || status === "sent"}
                className={cn(
                  isTerminal
                    ? "rounded-none font-mono border-[#00ff4130] bg-black text-[#00ff41] placeholder:text-[#00aa30] focus:border-[#00ff41]"
                    : isCasino
                      ? "casino-input font-serif text-[#fef3c7] placeholder:text-[#9ca3af] focus:border-[#dc2626]"
                      : isNewspaper
                        ? "rounded-none font-serif border-[#c4b59e] bg-[#efe8da] text-[#1a1208] placeholder:text-[#7a6b5a] focus:border-[#5c2e0e]"
                        : "bg-white/50 dark:bg-neutral-900/50",
                )}
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className={cn(
                  isTerminal && "font-mono text-[#00aa30]",
                  isCasino && "font-serif text-[#dc2626] tracking-wider",
                  isNewspaper && "font-serif text-[#5c2e0e]",
                )}
              >
                {isTerminal ? "> email:" : "Email"}
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder={isTerminal ? "enter_email..." : "you@example.com"}
                required
                disabled={status === "sending" || status === "sent"}
                className={cn(
                  isTerminal
                    ? "rounded-none font-mono border-[#00ff4130] bg-black text-[#00ff41] placeholder:text-[#00aa30] focus:border-[#00ff41]"
                    : isCasino
                      ? "casino-input font-serif text-[#fef3c7] placeholder:text-[#9ca3af] focus:border-[#dc2626]"
                      : isNewspaper
                        ? "rounded-none font-serif border-[#c4b59e] bg-[#efe8da] text-[#1a1208] placeholder:text-[#7a6b5a] focus:border-[#5c2e0e]"
                        : "bg-white/50 dark:bg-neutral-900/50",
                )}
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="message"
                className={cn(
                  isTerminal && "font-mono text-[#00aa30]",
                  isCasino && "font-serif text-[#dc2626] tracking-wider",
                  isNewspaper && "font-serif text-[#5c2e0e]",
                )}
              >
                {isTerminal ? "> message:" : "Message"}
              </Label>
              <Textarea
                id="message"
                name="message"
                placeholder={isTerminal ? "enter_message..." : "What's on your mind?"}
                required
                rows={5}
                disabled={status === "sending" || status === "sent"}
                className={cn(
                  "resize-none",
                  isTerminal
                    ? "rounded-none font-mono border-[#00ff4130] bg-black text-[#00ff41] placeholder:text-[#00aa30] focus:border-[#00ff41]"
                    : isCasino
                      ? "casino-input font-serif text-[#fef3c7] placeholder:text-[#9ca3af] focus:border-[#dc2626]"
                      : isNewspaper
                        ? "rounded-none font-serif border-[#c4b59e] bg-[#efe8da] text-[#1a1208] placeholder:text-[#7a6b5a] focus:border-[#5c2e0e]"
                        : "bg-white/50 dark:bg-neutral-900/50",
                )}
              />
            </div>

            {status === "error" && (
              <div className="flex items-center gap-2 text-sm" style={{ color: isTerminal ? "#ff3333" : isCasino ? "#dc2626" : undefined }}>
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span className={isTerminal ? "font-mono" : isCasino ? "font-serif" : isNewspaper ? "font-serif" : ""}>
                  {errorMsg}
                </span>
              </div>
            )}

            <Button
              type="submit"
              disabled={status === "sending" || status === "sent"}
              className={cn(
                "w-full",
                isTerminal
                  ? "rounded-none font-mono uppercase tracking-wider border border-[#00ff41] bg-transparent text-[#00ff41] hover:bg-[#00ff41] hover:text-black terminal-glow"
                  : isCasino
                    ? "casino-btn font-serif uppercase tracking-wider px-8"
                    : isNewspaper
                      ? "rounded-none font-serif uppercase tracking-wider border-2 border-[#1a1208] bg-transparent text-[#1a1208] hover:bg-[#1a1208] hover:text-[#f7f2ea]"
                      : "rounded-full",
              )}
            >
              {status === "sending" ? (
                isTerminal ? "[ sending... ]" : "Sending..."
              ) : status === "sent" ? (
                <>
                  <CheckCircle className="mr-2 h-3.5 w-3.5" />
                  {isTerminal ? "message_sent" : "Message sent"}
                </>
              ) : (
                <>
                  {isTerminal ? "[ send_message ]" : isCasino ? "Place Your Bet" : isNewspaper ? "Send Message" : "Send Message"}
                  {!isTerminal && !isCasino && !isNewspaper && <Send className="ml-2 h-3.5 w-3.5" />}
                </>
              )}
            </Button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
