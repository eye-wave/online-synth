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
</script>

<dialog
  aria-hidden="true"
  bind:this={dialog}
  on:keydown={onKeyDown}
  style={$$props.style}
  class={$$props.class}
>
  <slot name="btn">
    <button on:click={close}>X</button>
  </slot>
  <slot />
</dialog>
