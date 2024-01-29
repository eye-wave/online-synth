<script lang="ts">
  import { Chart3d, Chart3dOptions } from "pkg/wavetable_synth"
  import { onDestroy, onMount } from "svelte"

  export let width = 480
  export let height = 360
  export let wavetable: Float32Array
  export let frame: number
  export let framesize: number
  export let color: number

  export let scaleY = 0.5
  export let yaw = 0.51
  export let pitch = 0.42
  export let zoom = 1.2

  const chartOptions = new Chart3dOptions(color, pitch, yaw, zoom, scaleY)
  onDestroy(() => chartOptions.free())

  $: chartOptions.color = color
  $: chartOptions.pitch = pitch
  $: chartOptions.scale_y = scaleY
  $: chartOptions.yaw = yaw
  $: chartOptions.zoom = zoom

  let canvas: HTMLCanvasElement
  let ctx: CanvasRenderingContext2D

  let canvas_bg: HTMLCanvasElement
  let ctx_bg: CanvasRenderingContext2D

  $: onWavetableChange(wavetable)
  $: onFrameChange(frame)

  function onWavetableChange(wavetable: Float32Array) {
    if (!canvas_bg) return
    if (!ctx_bg) return

    ctx_bg.clearRect(0, 0, width, height)
    Chart3d.draw_bg(canvas_bg, wavetable, framesize, chartOptions)

    onFrameChange(frame)
  }

  function onFrameChange(frame: number) {
    if (!canvas) return
    if (!ctx) return

    ctx.clearRect(0, 0, width, height)
    Chart3d.draw_frame(canvas, wavetable, framesize, frame - 1, chartOptions)
  }

  onMount(() => {
    ctx = canvas.getContext("2d") as CanvasRenderingContext2D
    ctx_bg = canvas_bg.getContext("2d") as CanvasRenderingContext2D

    if (!ctx || !ctx_bg) throw ":("

    onWavetableChange(wavetable)
    onFrameChange(frame)
  })
</script>

<div>
  <canvas {width} {height} bind:this={canvas}></canvas>
  <canvas {width} {height} bind:this={canvas_bg}></canvas>
</div>

<style>
  div {
    position: relative;
  }

  canvas {
    position: absolute;
    inset: 0;
  }
</style>
