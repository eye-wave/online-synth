<script lang="ts">
  import { Chart3d, Chart3dOptions } from "pkg/wavetable_synth"
  import { globalConsts } from "src/lib/stores/constants"
  import { onDestroy, onMount } from "svelte"
  import { wavetableStore } from "./wavetable"

  export let width = 480
  export let height = 360
  export let color: number

  export let scaleY = 0.5
  export let yaw = 0.51
  export let pitch = 0.42
  export let zoom = 1.2

  const chartOptions = new Chart3dOptions(color, pitch, yaw, zoom, scaleY)
  onDestroy(() => chartOptions.free())

  $: bufferStore = wavetableStore.bufferStore
  $: frameStore = wavetableStore.frameStore

  $: chartOptions.color = color
  $: chartOptions.pitch = pitch
  $: chartOptions.scale_y = scaleY
  $: chartOptions.yaw = yaw
  $: chartOptions.zoom = zoom

  let canvas: HTMLCanvasElement
  let ctx: CanvasRenderingContext2D

  let canvas_bg: HTMLCanvasElement
  let ctx_bg: CanvasRenderingContext2D

  $: onWavetableChange($bufferStore)
  $: onFrameChange($frameStore)

  const unsubscribe = wavetableStore.bufferStore.subscribe(onWavetableChange)

  function onWavetableChange(wavetable: Float32Array) {
    if (!canvas_bg) return
    if (!ctx_bg) return

    ctx_bg.clearRect(0, 0, width, height)
    Chart3d.draw_bg(canvas_bg, wavetable, globalConsts.windowSize, chartOptions)

    onFrameChange($frameStore)
  }

  function onFrameChange(frame: number) {
    if (!canvas) return
    if (!ctx) return

    ctx.clearRect(0, 0, width, height)
    Chart3d.draw_frame(canvas, $bufferStore, globalConsts.windowSize, frame - 1, chartOptions)
  }

  onMount(() => {
    ctx = canvas.getContext("2d") as CanvasRenderingContext2D
    ctx_bg = canvas_bg.getContext("2d") as CanvasRenderingContext2D

    if (!ctx || !ctx_bg) throw ":("

    onWavetableChange($bufferStore)
    onFrameChange($frameStore)
  })

  onDestroy(unsubscribe)
</script>

<div>
  <canvas {width} {height} bind:this={canvas}></canvas>
  <canvas {width} {height} bind:this={canvas_bg}></canvas>
</div>

<style>
  div {
    position: relative;
    flex-shrink: 0;
  }

  canvas {
    position: absolute;
    inset: 0;
  }
</style>
