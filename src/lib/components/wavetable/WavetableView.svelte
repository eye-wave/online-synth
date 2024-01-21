<script lang="ts">
  import { globalStore } from "src/lib/global"
  import { onMount } from "svelte"

  export let width = 480
  export let height = 360
  export let wavetable: Float32Array
  export let frame: number

  let canvas: HTMLCanvasElement
  let ctx: CanvasRenderingContext2D

  $: updateCanvas(ctx, wavetable, frame)

  function updateCanvas(ctx: CanvasRenderingContext2D, wavetable: Float32Array, frame: number) {
    if (!ctx) return

    const frameSize = Math.floor($globalStore.audioContext.sampleRate / $globalStore.BASE_FREQUENCY)
    const startingPoint = frameSize * (frame - 1)

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.beginPath()
    ctx.strokeStyle = "red"

    for (let i = startingPoint; i < startingPoint + frameSize; i += 4) {
      const x = (i - startingPoint) * (canvas.width / frameSize)
      const y = wavetable[i] * canvas.height * 0.5 + canvas.height / 2

      if (wavetable[i] > 1) console.log(wavetable[i])

      ctx.lineTo(x, y)
    }

    ctx.stroke()
  }

  onMount(() => {
    ctx = canvas.getContext("2d")!
  })
</script>

<canvas {width} {height} bind:this={canvas}></canvas>
