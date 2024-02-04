<script lang="ts">
  export let width = 480
  export let height = 360
  export let color: number

  let canvas: HTMLCanvasElement
</script>

<canvas style:color {width} {height} bind:this={canvas}></canvas>
