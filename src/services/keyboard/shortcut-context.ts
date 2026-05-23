import type { Scope } from "obsidian";
import type { KeyboardRegistry } from "./keyboard-registry";
import type { ShortcutDefinition, KeyCombo } from "./shortcut-types";

export class ShortcutContext {
  private registered = new Map<string, ShortcutDefinition>();

  constructor(
    private readonly scope: Scope,
    private readonly registry?: KeyboardRegistry,
  ) {}

  register(shortcut: ShortcutDefinition): void {
    if (this.registered.has(shortcut.id)) {
      this.unregister(shortcut.id);
    }
    for (const combo of shortcut.keys) {
      this.bindCombo(shortcut, combo);
    }
    this.registered.set(shortcut.id, shortcut);
    this.registry?.add(shortcut);
  }

  registerMany(shortcuts: ShortcutDefinition[]): void {
    for (const s of shortcuts) this.register(s);
  }

  unregister(id: string): void {
    this.registered.delete(id);
    this.registry?.remove(id);
  }

  unregisterAll(): void {
    for (const id of Array.from(this.registered.keys())) {
      this.unregister(id);
    }
  }

  private bindCombo(shortcut: ShortcutDefinition, combo: KeyCombo): void {
    const modifiers = combo.modifiers ?? [];
    this.scope.register(modifiers, combo.key, (event: KeyboardEvent) => {
      if (this.shouldSkip(event)) return true;
      if (shortcut.when && !shortcut.when()) return true;
      const result = shortcut.action(event);
      return result === false ? true : false;
    });
  }

  private shouldSkip(event: KeyboardEvent): boolean {
    const target = event.target as HTMLElement | null;
    if (!target) return false;
    const tag = target.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
    if (target.isContentEditable) return true;
    return false;
  }
}
