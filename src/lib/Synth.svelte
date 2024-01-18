<script lang="ts">
  import { onMount } from "svelte";
  import { generateWaveformData } from "./generator";

  export let audioContext:AudioContext
  
  const sine = generateWaveformData(audioContext,100)
  const saw = generateWaveformData(audioContext,100,
    Array(200).fill(0).map((_,i) => (i % 1 === 0 ? 0.4 : 0) / ( i +1 )),
    Array(200).fill(0).map(() => Math.random() * Math.PI * 2 * 0)
  )
  const square = generateWaveformData(audioContext,100,
    Array(200).fill(0).map((_,i) => (i % 2 === 0 ? 0.4 : 0) / ( i +1 )),
    Array(200).fill(0).map(() => Math.random() * Math.PI * 2 * 0)
  )
  const tri = generateWaveformData(audioContext,100,
    Array(200).fill(0).map((_,i) => (i % 2 === 0 ? (8 / Math.PI ** 2) * (-1) ** (i / 2) / (i + 1) ** 2 : 0)),
    Array(200).fill(0).map(() => Math.random() * Math.PI * 2 * 0)
  )

  const data = new Float32Array([
    ...sine,
    ...saw,
    ...square,
    ...tri,
  ])

  const audioBuffer = audioContext.createBuffer(1,data.length,audioContext.sampleRate)
  const channelData = audioBuffer.getChannelData(0)
  channelData.set(data)

  const frequency = 44

  const source = audioContext.createBufferSource()
  source.buffer = audioBuffer
  source.loop = true
  source.loopStart = (1 / 100) * 2
  source.loopEnd = (1 / 100) * 3
  source.playbackRate.setValueAtTime(frequency / 100,0)

  // source.connect(audioContext.destination)
  // source.start(source.loopStart)
  // source.stop(audioContext.currentTime + 5)

  let canvas:HTMLCanvasElement
  let ctx:CanvasRenderingContext2D

  onMount(() => {
    ctx = canvas.getContext("2d")!
    canvas.width = 400
    canvas.height = 300

    ctx.fillRect(0,0,canvas.width,canvas.height)
    ctx.strokeStyle = "red"

    ctx.beginPath()
    ctx.moveTo(0,0)
    data.forEach((y,x,{ length: l }) => ctx.lineTo(x *canvas.width/(l-1),y * canvas.height /2 + canvas.height /2))
    ctx.stroke()

    ctx.strokeStyle = "lime"
    ctx.beginPath()
    ctx.moveTo(0,canvas.height /2)
    ctx.lineTo(canvas.width,canvas.height /2)
    ctx.stroke()
  })
</script>

<canvas bind:this={canvas}></canvas>

