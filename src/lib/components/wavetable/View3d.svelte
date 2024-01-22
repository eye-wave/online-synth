<script lang="ts">
  import { Chart } from "pkg/wavetable_synth"
  import { onMount } from "svelte"

  export let width = 480
  export let height = 360
  export let wavetable: Float32Array
  export let frame: number
  export let framesize: number
  export let color: number

  let canvas: HTMLCanvasElement
  let ctx: CanvasRenderingContext2D

  $: updateCanvas(canvas, ctx, wavetable, frame)

  function updateCanvas(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    wavetable: Float32Array,
    frame: number,
  ) {
    if (!canvas) return
    if (!ctx) return

    ctx.clearRect(0, 0, width, height)
    Chart.draw3d(canvas, wavetable, framesize, frame - 1, color)
  }

  onMount(() => {
    ctx = canvas.getContext("2d")!
  })
</script>

<canvas {width} {height} bind:this={canvas}></canvas>
