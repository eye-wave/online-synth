<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte"
  export let open = false

  type CommonModalEvents = {
    close: void
  }

  const dispatch = createEventDispatcher<CommonModalEvents>()

  let dialog: HTMLDialogElement

  onMount(() => {
    open = true
    dialog.showModal()
  })

  function close() {
    if (!dialog) return
    open = false

    dialog.close()
    dispatch("close")
  }

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === "Escape") close()
  }

  function onClick(e: MouseEvent) {
    const target = e.target as HTMLElement
    if (target.nodeName === "DIALOG") close()
  }
</script>

<svelte:window on:keydown={onKeyDown} on:click={onClick} />

<dialog bind:this={dialog} style={$$props.style} class={$$props.class}>
  <main>
    <slot name="btn">
      <button on:click={close}>X</button>
    </slot>
    <slot />
  </main>
</dialog>

<style>
  dialog {
    padding: 0;
  }

  main {
    padding: 1rem;
  }

  dialog::backdrop {
    background: #00000060;
    backdrop-filter: blur(1rem);
  }
</style>
