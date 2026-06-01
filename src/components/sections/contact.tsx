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
import {
  REVEAL_DURATION,
  REVEAL_Y_OFFSET,
  STAGGER_DELAY,
  FORM_STATUS_TIMEOUT_MS,
} from "@/config/animations";
import { terminalPalette, newspaperPalette } from "@/config/theme-palette";
import { FORM_STATUS_ARIA_LIVE, CONTACT_FORM_LABEL } from "@/config/accessibility";

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
      setTimeout(() => setStatus("idle"), FORM_STATUS_TIMEOUT_MS);
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error ? err.message : "Failed to send.",
      );
      setTimeout(() => setStatus("idle"), FORM_STATUS_TIMEOUT_MS);
    }
  };

  return (
    <section id="contact" className="py-24 px-6" ref={ref}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: REVEAL_Y_OFFSET }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: REVEAL_DURATION }}
          className="mb-12"
        >
          {isTerminal ? (
            <div>
              <p
                className="text-xs font-mono mb-2 tracking-wider"
                data-terminal-prompt
                style={{ color: terminalPalette.secondary }}
              >
                contact
              </p>
              <h2
                className="text-2xl sm:text-3xl font-bold font-mono terminal-glow uppercase tracking-wider"
                style={{ color: terminalPalette.primary }}
              >
                Establish.Link
              </h2>
              <p
                className="text-sm font-mono mt-4 max-w-lg"
                style={{ color: terminalPalette.secondary }}
              >
                Have a project in mind, want to collaborate, or just want to
                say hi?
                {"\n"}Drop me a message and I&apos;ll get back to you.
              </p>
            </div>
          ) : isCasino ? (
            <div>
              <p className="casino-label mb-2">CONTACT</p>
              <h2 className="text-3xl sm:text-4xl font-bold font-serif text-white tracking-tight mb-4">
                Place Your Hand
              </h2>
              <div className="w-16 h-px bg-gradient-to-r from-[#d4af37] to-transparent mb-4" />
              <p
                className="font-serif max-w-lg leading-relaxed"
                style={{ color: "#c8bfb2" }}
              >
                Have a project in mind, want to collaborate, or just want to
                say hi? Drop me a message and I&apos;ll get back to you.
              </p>
            </div>
          ) : isNewspaper ? (
            <div>
              <p
                className="text-xs font-serif tracking-[0.2em] mb-1 uppercase"
                data-newspaper-section
                style={{ color: newspaperPalette.muted }}
              >
                Contact
              </p>
              <hr className="newspaper-rule" />
              <h2
                className="text-3xl sm:text-4xl font-bold font-serif mt-4"
                style={{ color: newspaperPalette.primary }}
              >
                Let&apos;s Connect
              </h2>
              <p
                className="font-serif mt-4 max-w-lg leading-relaxed"
                style={{ color: newspaperPalette.body }}
              >
                Have a project in mind, want to collaborate, or just want to
                say hi? Drop me a message and I&apos;ll get back to you.
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
                Have a project in mind, want to collaborate, or just want to
                say hi? Drop me a message and I&apos;ll get back to you.
              </p>
            </>
          )}
        </motion.div>

        <div
          className={cn(
            "grid md:grid-cols-2 gap-8",
            isNewspaper && "md:grid-cols-1",
            isCasino && "md:grid-cols-1",
          )}
        >
          {/* Social links sidebar */}
          <motion.div
            initial={{ opacity: 0, y: REVEAL_Y_OFFSET }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: REVEAL_DURATION,
              delay: STAGGER_DELAY,
            }}
            className="space-y-4"
          >
            <div className="space-y-3">
              <h3
                className={cn(
                  "text-sm font-semibold uppercase tracking-wider text-neutral-400",
                  isTerminal && "font-mono",
                  isCasino && "font-serif tracking-[0.2em]",
                  isNewspaper && "font-serif tracking-[0.15em]",
                )}
                style={
                  isTerminal
                    ? { color: terminalPalette.secondary }
                    : isCasino
                      ? { color: "#d4af37" }
                      : isNewspaper
                        ? { color: newspaperPalette.muted }
                        : undefined
                }
              >
                {isTerminal
                  ? "$ find --links"
                  : isCasino
                    ? "Connect"
                    : isNewspaper
                      ? "Find me on"
                      : "Find me on"}
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
                      isTerminal &&
                        "terminal-card rounded-none",
                      isCasino &&
                        "casino-card rounded-lg border-[#d4af37]/15 hover:bg-[#1c0c0c]/80",
                      isNewspaper &&
                        "newspaper-card rounded-none",
                      !isTerminal &&
                        !isCasino &&
                        !isNewspaper &&
                        "border-neutral-200/50 dark:border-neutral-700/50 bg-white/30 dark:bg-neutral-900/30 hover:bg-white/60 dark:hover:bg-neutral-800/60",
                    )}
                    style={
                      isTerminal
                        ? { color: terminalPalette.primary }
                        : isCasino
                          ? { color: "#c8bfb2" }
                          : isNewspaper
                            ? { color: newspaperPalette.primary }
                            : undefined
                    }
                  >
                    <Icon
                      className={cn(
                        "h-5 w-5 transition-colors",
                        isTerminal && "text-[#00ff41]",
                        isCasino && "group-hover:text-white",
                        isNewspaper && "group-hover:text-[#1a1208]",
                        !isTerminal &&
                          !isCasino &&
                          !isNewspaper &&
                          "text-neutral-400 group-hover:text-foreground",
                      )}
                      style={
                        isCasino
                          ? { color: "#d4af37" }
                          : isNewspaper
                            ? { color: "#5c2e0e" }
                            : undefined
                      }
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
                        isTerminal &&
                          "group-hover:text-[#00ff41]",
                        isCasino && "group-hover:text-[#d4af37]",
                        isNewspaper &&
                          "group-hover:text-[#1a1208]",
                        !isTerminal &&
                          !isCasino &&
                          !isNewspaper &&
                          "text-neutral-300 dark:text-neutral-600 group-hover:text-foreground",
                      )}
                      style={
                        isTerminal
                          ? { color: "#00ff4140" }
                          : isCasino
                            ? { color: "#d4af37" }
                            : isNewspaper
                              ? { color: "#c4b59e" }
                              : undefined
                      }
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
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
                    isTerminal &&
                      "terminal-card rounded-none",
                    isCasino &&
                      "casino-card rounded-lg border-[#d4af37]/15 hover:bg-[#1c0c0c]/80",
                    isNewspaper &&
                      "newspaper-card rounded-none",
                    !isTerminal &&
                      !isCasino &&
                      !isNewspaper &&
                      "border-neutral-200/50 dark:border-neutral-700/50 bg-white/30 dark:bg-neutral-900/30 hover:bg-white/60 dark:hover:bg-neutral-800/60",
                  )}
                  style={
                    isTerminal
                      ? { color: terminalPalette.primary }
                      : isCasino
                        ? { color: "#c8bfb2" }
                        : isNewspaper
                          ? { color: newspaperPalette.primary }
                          : undefined
                  }
                >
                  <svg
                    className={cn(
                      "h-5 w-5 transition-colors",
                      isTerminal && "text-[#00ff41]",
                      isCasino && "group-hover:text-white",
                      isNewspaper && "group-hover:text-[#1a1208]",
                      !isTerminal &&
                        !isCasino &&
                        !isNewspaper &&
                        "text-neutral-400 group-hover:text-foreground",
                    )}
                    style={
                      isCasino
                        ? { color: "#d4af37" }
                        : isNewspaper
                          ? { color: "#5c2e0e" }
                          : undefined
                    }
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
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
            initial={{ opacity: 0, y: REVEAL_Y_OFFSET }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: REVEAL_DURATION,
              delay: STAGGER_DELAY * 3,
            }}
            onSubmit={handleSubmit}
            className="space-y-4"
            aria-label={CONTACT_FORM_LABEL}
            noValidate
          >
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className={cn(
                  isTerminal && "font-mono",
                  isCasino && "font-serif tracking-wider",
                  isNewspaper && "font-serif",
                )}
                style={
                  isTerminal
                    ? { color: terminalPalette.secondary }
                    : isCasino
                      ? { color: "#d4af37" }
                      : isNewspaper
                        ? { color: "#5c2e0e" }
                        : undefined
                }
              >
                {isTerminal
                  ? "> name:"
                  : isCasino
                    ? "Your Name"
                    : "Name"}
              </Label>
              <Input
                id="name"
                name="name"
                placeholder={isTerminal ? "enter_name..." : "Your name"}
                required
                disabled={status === "sending" || status === "sent"}
                autoComplete="name"
                className={cn(
                  isTerminal
                    ? "rounded-none font-mono bg-black text-[#00ff41] placeholder:text-[#00aa30] focus:border-[#00ff41]"
                    : isCasino
                      ? "casino-input font-serif text-[#f5f0e8] placeholder:text-[#8a7e72] focus:border-[#d4af37]"
                      : isNewspaper
                        ? "rounded-none font-serif border-[#c4b59e] bg-[#efe8da] text-[#1a1208] placeholder:text-[#7a6b5a] focus:border-[#5c2e0e]"
                        : "bg-white/50 dark:bg-neutral-900/50",
                )}
                style={
                  isTerminal
                    ? { borderColor: "#00ff4130" }
                    : undefined
                }
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className={cn(
                  isTerminal && "font-mono",
                  isCasino && "font-serif tracking-wider",
                  isNewspaper && "font-serif",
                )}
                style={
                  isTerminal
                    ? { color: terminalPalette.secondary }
                    : isCasino
                      ? { color: "#d4af37" }
                      : isNewspaper
                        ? { color: "#5c2e0e" }
                        : undefined
                }
              >
                {isTerminal
                  ? "> email:"
                  : isCasino
                    ? "Your Email"
                    : "Email"}
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder={isTerminal ? "enter_email..." : "your@email.com"}
                required
                disabled={status === "sending" || status === "sent"}
                autoComplete="email"
                className={cn(
                  isTerminal
                    ? "rounded-none font-mono bg-black text-[#00ff41] placeholder:text-[#00aa30] focus:border-[#00ff41]"
                    : isCasino
                      ? "casino-input font-serif text-[#f5f0e8] placeholder:text-[#8a7e72] focus:border-[#d4af37]"
                      : isNewspaper
                        ? "rounded-none font-serif border-[#c4b59e] bg-[#efe8da] text-[#1a1208] placeholder:text-[#7a6b5a] focus:border-[#5c2e0e]"
                        : "bg-white/50 dark:bg-neutral-900/50",
                )}
                style={
                  isTerminal
                    ? { borderColor: "#00ff4130" }
                    : undefined
                }
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="message"
                className={cn(
                  isTerminal && "font-mono",
                  isCasino && "font-serif tracking-wider",
                  isNewspaper && "font-serif",
                )}
                style={
                  isTerminal
                    ? { color: terminalPalette.secondary }
                    : isCasino
                      ? { color: "#d4af37" }
                      : isNewspaper
                        ? { color: "#5c2e0e" }
                        : undefined
                }
              >
                {isTerminal
                  ? "> message:"
                  : "Message"}
              </Label>
              <Textarea
                id="message"
                name="message"
                placeholder={
                  isTerminal
                    ? "enter_message..."
                    : "What&apos;s on your mind?"
                }
                required
                rows={5}
                disabled={status === "sending" || status === "sent"}
                className={cn(
                  "resize-none",
                  isTerminal
                    ? "rounded-none font-mono bg-black text-[#00ff41] placeholder:text-[#00aa30] focus:border-[#00ff41]"
                    : isCasino
                      ? "casino-input font-serif text-[#f5f0e8] placeholder:text-[#8a7e72] focus:border-[#d4af37]"
                      : isNewspaper
                        ? "rounded-none font-serif border-[#c4b59e] bg-[#efe8da] text-[#1a1208] placeholder:text-[#7a6b5a] focus:border-[#5c2e0e]"
                        : "bg-white/50 dark:bg-neutral-900/50",
                )}
                style={
                  isTerminal
                    ? { borderColor: "#00ff4130" }
                    : undefined
                }
              />
            </div>

            {/* Form status (live region for screen readers) */}
            <div
              aria-live={FORM_STATUS_ARIA_LIVE}
              aria-atomic="true"
              className="min-h-[1.5rem]"
            >
              {status === "error" && (
                <div className="flex items-center gap-2 text-sm">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span
                    className={cn(
                      isTerminal && "font-mono",
                      isCasino && "font-serif",
                      isNewspaper && "font-serif",
                    )}
                    style={
                      isTerminal
                        ? { color: terminalPalette.error }
                        : isCasino
                          ? { color: "#d4af37" }
                          : undefined
                    }
                  >
                    {errorMsg}
                  </span>
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={status === "sending" || status === "sent"}
              className={cn(
                "w-full",
                isTerminal &&
                  "rounded-none font-mono uppercase tracking-wider border bg-transparent hover:bg-[#00ff41] hover:text-black terminal-glow",
                isCasino &&
                  "casino-btn font-serif uppercase tracking-wider px-8",
                isNewspaper &&
                  "rounded-none font-serif uppercase tracking-wider border-2 bg-transparent hover:bg-[#1a1208] hover:text-[#f7f2ea]",
                !isTerminal &&
                  !isCasino &&
                  !isNewspaper &&
                  "rounded-full",
              )}
              style={
                isTerminal
                  ? {
                      borderColor: terminalPalette.primary,
                      color: terminalPalette.primary,
                    }
                  : isNewspaper
                    ? {
                        borderColor: newspaperPalette.primary,
                        color: newspaperPalette.primary,
                      }
                    : undefined
              }
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
                  {isTerminal
                    ? "[ send_message ]"
                    : isCasino
                      ? "Place Your Bet"
                      : isNewspaper
                        ? "Send Message"
                        : "Send Message"}
                  {!isTerminal &&
                    !isCasino &&
                    !isNewspaper && (
                      <Send className="ml-2 h-3.5 w-3.5" />
                    )}
                </>
              )}
            </Button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
