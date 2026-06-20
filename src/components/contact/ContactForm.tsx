"use client";

import { useState } from "react";
import { TextInput, Textarea, Button, Alert } from "@mantine/core";
import { motion, AnimatePresence } from "framer-motion";
import { IconCheck, IconAlertCircle } from "@tabler/icons-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { fadeUp } from "@/lib/animations";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (values.name.trim().length < 2) e.name = "Name must be at least 2 characters";
    if (!/^\S+@\S+\.\S+$/.test(values.email)) e.email = "Please enter a valid email";
    if (values.message.trim().length < 10) e.message = "Message must be at least 10 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to send message");
      }

      setStatus("success");
      setValues({ name: "", email: "", message: "" });
      setErrors({});
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong"
      );
    }
  }

  const inputStyles = {
    label: { color: "var(--mantine-color-zinc-700)", fontWeight: 500 },
  };

  return (
    <ScrollReveal variants={fadeUp}>
      <form onSubmit={handleSubmit} className="space-y-5 max-w-lg mx-auto">
        <TextInput
          label="Name"
          placeholder="Your name"
          required
          value={values.name}
          onChange={(e) => setValues({ ...values, name: e.currentTarget.value })}
          error={errors.name}
          styles={inputStyles}
        />

        <TextInput
          label="Email"
          placeholder="you@example.com"
          required
          value={values.email}
          onChange={(e) => setValues({ ...values, email: e.currentTarget.value })}
          error={errors.email}
          styles={inputStyles}
        />

        <Textarea
          label="Message"
          placeholder="Tell me what's on your mind..."
          required
          minRows={5}
          value={values.message}
          onChange={(e) => setValues({ ...values, message: e.currentTarget.value })}
          error={errors.message}
          styles={inputStyles}
        />

        <AnimatePresence mode="wait">
          {status === "success" && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Alert
                icon={<IconCheck className="w-4 h-4" />}
                color="green"
                variant="light"
              >
                Message sent successfully! I&apos;ll get back to you soon.
              </Alert>
            </motion.div>
          )}

          {status === "error" && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Alert
                icon={<IconAlertCircle className="w-4 h-4" />}
                color="red"
                variant="light"
              >
                {errorMessage}
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        <Button
          type="submit"
          loading={status === "loading"}
          fullWidth
          size="lg"
          className="!bg-zinc-900 dark:!bg-white !text-white dark:!text-zinc-900 hover:!bg-zinc-800 dark:hover:!bg-zinc-100 !rounded-full !font-medium"
        >
          Send Message
        </Button>
      </form>
    </ScrollReveal>
  );
}
