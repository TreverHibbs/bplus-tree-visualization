export function cssVar(name: string, value?: string): string {
  if (name[0] != '-') name = '--' + name
  if (value) document.documentElement.style.setProperty(name, value)
  return getComputedStyle(document.documentElement).getPropertyValue(name);
}
