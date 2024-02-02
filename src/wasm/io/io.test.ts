import { $, write } from "bun"
import { describe, test, expect } from "bun:test"
import { get } from "svelte/store"
import { globalStore } from "src/lib/global"
import { Wavetables, IO } from "pkg/wavetable_synth"

describe("Encoding wavetable to 'audio/wav' file", () => {
  test("Sox should analyze the file wihout an error", async () => {
    const freq = get(globalStore).BASE_FREQUENCY
    const samplerate = 44100
    const filepath = "/tmp/wavetable.wav"

    const table = Wavetables.generate_basic_shapes_table(samplerate, freq)
    const buffer = IO.encode_wav(table, samplerate)

    await write(filepath, buffer)
    const { exitCode } = await $`sox --info ${filepath}`

    await $`rm ${filepath}`

    expect(exitCode).toBe(0)
  })
})
