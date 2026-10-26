// Shared class strings for the DESIGN.md components.
// Plain strings (not React components) so they work on <button>, <a>,
// <Link>, <input> etc. without wrapper props.

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-text";

// One per screen. 54px tall, red fill, white text.
export const buttonPrimary = `flex min-h-[54px] w-full items-center justify-center gap-2 rounded-control bg-red px-5 text-base font-semibold text-white hover:brightness-110 disabled:opacity-60 ${focusRing}`;

// Outline button. Defaults to 44px; add w-full / min-h-[54px] where needed.
export const buttonSecondary = `flex min-h-[44px] items-center justify-center gap-2 rounded-control border border-line-strong px-4 text-sm font-semibold text-text hover:bg-surface disabled:opacity-60 ${focusRing}`;

// Destructive action, outline style — red is reserved for the primary button.
export const buttonDanger = `flex min-h-[44px] items-center justify-center gap-2 rounded-control border border-line-strong px-4 text-sm font-semibold text-red-text hover:bg-surface disabled:opacity-60 ${focusRing}`;

// 44px icon-only button. Always pass an aria-label.
export const iconButton = `flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface-2 text-text-soft hover:text-text disabled:opacity-30 ${focusRing}`;

export const label = "mb-1.5 block text-sm font-semibold text-text-soft";

// 52px tall inputs. Textareas reuse this minus the fixed height.
export const input =
  "block min-h-[52px] w-full rounded-control border border-line-strong bg-surface px-4 py-3 text-base text-text placeholder:text-faint focus:outline-2 focus:outline-offset-0 focus:outline-red-text [color-scheme:dark]";

// Filter chips are buttons/links (min 44px). Tag chips use `tag`.
export function chip(selected: boolean) {
  return `inline-flex min-h-[44px] shrink-0 items-center rounded-full px-4 text-[13px] font-semibold uppercase tracking-wide ${focusRing} ${
    selected
      ? "bg-red text-white"
      : "border border-line-strong text-text-soft hover:text-text"
  }`;
}

export const tag =
  "inline-flex items-center rounded-full border border-line-strong px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-text-soft";

export const card = "rounded-card bg-surface p-4";

// List row: divider below, no card background.
export const listRow = "flex min-h-[72px] items-center gap-4 border-b border-line py-3";

export const meta = "text-[13px] text-muted";
