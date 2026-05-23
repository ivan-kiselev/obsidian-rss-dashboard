import type { Modifier } from "obsidian";

export type ShortcutModifier = Modifier;

export interface KeyCombo {
  key: string;
  modifiers?: ShortcutModifier[];
}

export interface ShortcutDefinition {
  id: string;
  group: string;
  description: string;
  keys: KeyCombo[];
  when?: () => boolean;
  action: (event: KeyboardEvent) => void | boolean;
}
