"use client";

import { ContactForm } from "@/components/contact/ContactForm";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { fadeUp } from "@/lib/animations";
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconMail,
  IconMapPin,
} from "@tabler/icons-react";

const contactMethods = [
  {
    icon: IconMail,
    label: "Email",
    value: "lance@lanceabuan.tech",
    href: "mailto:lance@lanceabuan.tech",
  },
  {
    icon: IconBrandGithub,
    label: "GitHub",
    value: "LanceAbuan",
    href: "https://github.com/LanceAbuan",
  },
  {
    icon: IconBrandLinkedin,
    label: "LinkedIn",
    value: "lanceabuan",
    href: "https://linkedin.com/in/lanceabuan",
  },
  {
    icon: IconMapPin,
    label: "Location",
    value: "Available Remotely",
    href: null,
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen py-24 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <ScrollReveal variants={fadeUp}>
          <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2 tracking-wide uppercase">
            Contact
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-zinc-900 dark:text-white mb-4">
            Get in Touch
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-12 max-w-2xl">
            Have a project in mind, want to collaborate, or just want to say
            hi? Drop me a message.
          </p>
        </ScrollReveal>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            {contactMethods.map((method, i) => (
              <ScrollReveal key={method.label} delay={i * 0.1}>
                <div className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center flex-shrink-0">
                    <method.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {method.label}
                    </p>
                    {method.href ? (
                      <a
                        href={method.href}
                        target={method.href.startsWith("http") ? "_blank" : undefined}
                        rel={
                          method.href.startsWith("http")
                            ? "noopener noreferrer"
                            : undefined
                        }
                        className="text-sm font-medium text-zinc-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {method.value}
                      </a>
                    ) : (
                      <p className="text-sm font-medium text-zinc-900 dark:text-white">
                        {method.value}
                      </p>
                    )}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal variants={fadeUp} delay={0.2}>
            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-5">
                Send a Message
              </h2>
              <ContactForm />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
