<script lang="ts">
  import { Chart3d } from "pkg/plot"
  import { onMount } from "svelte"

  export let width = 480
  export let height = 360
  export let wavetable: Float32Array
  export let frame: number
  export let framesize: number
  export let color: number

  const scaleY = 0.5
  const yaw = 0.51
  const pitch = 0.42
  const zoom = 1.2

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
    Chart3d.draw_bg(canvas_bg, wavetable, framesize, color, pitch, yaw, zoom, scaleY)

    onFrameChange(frame, pitch, yaw)
  }

  function onFrameChange(frame: number) {
    if (!canvas) return
    if (!ctx) return

    ctx.clearRect(0, 0, width, height)
    Chart3d.draw_frame(canvas, wavetable, framesize, frame - 1, color, pitch, yaw, zoom, scaleY)
  }

  onMount(() => {
    ctx = canvas.getContext("2d") as CanvasRenderingContext2D
    ctx_bg = canvas_bg.getContext("2d") as CanvasRenderingContext2D

    if (!ctx || !ctx_bg) throw ":("

    onWavetableChange(wavetable, pitch, yaw)
    onFrameChange(frame, pitch, yaw)
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
