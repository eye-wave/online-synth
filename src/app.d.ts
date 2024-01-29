declare module "*.svg?component" {
  import type { ComponentType, SvelteComponentTyped } from "svelte"
  import type { SVGAttributes } from "svelte/elements"

  // biome-ignore lint/correctness/noUndeclaredVariables: d.ts
  const content = ComponentType<SvelteComponentTyped<SVGAttributes<SVGSVGElement>>>
  // biome-ignore lint/correctness/noUndeclaredVariables: d.ts
  export default content
}
