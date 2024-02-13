<script lang="ts">
  import { Chart2d } from "pkg/wavetable_synth"
  import { globalConsts } from "src/lib/stores/constants"
  import { onMount } from "svelte"
  import { wavetableStore } from "./wavetable"

  export let width = 480
  export let height = 360
  export let color: number

  $: bufferStore = wavetableStore.bufferStore
  $: frameStore = wavetableStore.frameStore

  let canvas: HTMLCanvasElement
  let ctx: CanvasRenderingContext2D

  $: updateCanvas(canvas, ctx, $bufferStore, $frameStore)

  function updateCanvas(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    buffer: Float32Array,
    frame: number,
  ) {
    if (!canvas) return
    if (!ctx) return

    ctx.clearRect(0, 0, width, height)
    Chart2d.draw(canvas, buffer, globalConsts.windowSize, frame - 1, color)
  }

  onMount(() => {
    ctx = canvas.getContext("2d")!

    if (!ctx) throw ":("
  })
</script>

<canvas {width} {height} bind:this={canvas}></canvas>
