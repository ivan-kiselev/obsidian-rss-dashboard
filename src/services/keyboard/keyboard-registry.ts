import type { ShortcutDefinition } from "./shortcut-types";

export class KeyboardRegistry {
  private active = new Map<string, ShortcutDefinition>();

  add(shortcut: ShortcutDefinition): void {
    this.active.set(shortcut.id, shortcut);
  }

  remove(id: string): void {
    this.active.delete(id);
  }

  list(): ShortcutDefinition[] {
    return Array.from(this.active.values());
  }

  byGroup(): Map<string, ShortcutDefinition[]> {
    const groups = new Map<string, ShortcutDefinition[]>();
    for (const s of this.active.values()) {
      const arr = groups.get(s.group) ?? [];
      arr.push(s);
      groups.set(s.group, arr);
    }
    return groups;
  }
}
