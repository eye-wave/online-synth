<script lang="ts">
  import CogIcon from "ico/cog.svg?component"
  import type { ComponentType, SvelteComponent } from "svelte"

  let Modal: ComponentType<SvelteComponent> | null = null
  async function modalPromise() {
    const { default: Component } = await import("./Modal.svelte")
    Modal = Component
  }

  let open = false
</script>

<button class="btn" on:click={() => (open = true)}>
  <CogIcon />
</button>

{#if open}
  {#await modalPromise() then _}
    <svelte:component this={Modal} bind:open />
  {/await}
{/if}

<style>
  button {
    position: absolute;
    top: 15px;
    right: 15px;
    padding: 4px;
  }
</style>
