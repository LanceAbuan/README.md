"use client";

import { useTheme } from "next-themes";
import { Popover, Button, Stack, UnstyledButton, Group, Text } from "@mantine/core";
import { Check, Palette, Sun, Moon, Monitor, Terminal, Newspaper, Sparkles, Trophy } from "lucide-react";
import { themes } from "@/config/theme-palette";
import {
  THEME_SELECTOR_LABEL,
  THEME_OPTION_LABEL,
} from "@/config/accessibility";

const THEME_ICONS: Record<string, React.ReactNode> = {
  light: <Sun className="h-4 w-4" />,
  dark: <Moon className="h-4 w-4" />,
  system: <Monitor className="h-4 w-4" />,
  terminal: <Terminal className="h-4 w-4" />,
  newspaper: <Newspaper className="h-4 w-4" />,
  synthwave: <Sparkles className="h-4 w-4" />,
  casino: <Trophy className="h-4 w-4" />,
  custom: <Palette className="h-4 w-4" />,
};

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  return (
    <Popover width={200} position="bottom-start" shadow="md">
      <Popover.Target>
        <Button
          variant="subtle"
          size="compact-sm"
          p={4}
          aria-label={THEME_SELECTOR_LABEL}
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
      </Popover.Target>
      <Popover.Dropdown>
        <Text size="xs" fw={500} tt="uppercase" c="dimmed" mb="xs">
          {THEME_SELECTOR_LABEL}
        </Text>
        <Stack gap={2}>
          {themes.map((t) => (
            <UnstyledButton
              key={t.value}
              onClick={() => setTheme(t.value)}
              aria-label={THEME_OPTION_LABEL(t.label)}
              p="xs"
              style={{ borderRadius: 4 }}
            >
              <Group gap="sm" justify="space-between">
                <Group gap="sm">
                  {THEME_ICONS[t.value] || <Palette className="h-4 w-4" />}
                  <Text size="sm">{t.label}</Text>
                </Group>
                {theme === t.value && (
                  <Check className="h-3.5 w-3.5" />
                )}
              </Group>
            </UnstyledButton>
          ))}
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
}
