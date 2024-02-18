<script lang="ts">
  import CogIcon from "ico/cog.svg?component"
  import type { ComponentType, SvelteComponent } from "svelte"

  let Modal: ComponentType<SvelteComponent> | null = null

  async function onClick() {
    if (!Modal) {
      const { default: Component } = await import("./Modal.svelte")
      Modal = Component
    }

    open = true
  }

  let open = false
</script>

<button class="btn" on:click={onClick} aria-label="settings">
  <CogIcon />
</button>

{#if open}
  <svelte:component this={Modal} bind:open />
{/if}

<style>
  button {
    position: absolute;
    top: 15px;
    right: 15px;
    padding: 4px;
  }
</style>
