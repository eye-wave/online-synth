import { $, write } from "bun"
import { describe, test, expect } from "bun:test"
import { get } from "svelte/store"
import { globalStore } from "src/lib/global"
import { IO, generate_saw_tooth } from "pkg-node/wavetable_synth"

describe("Encoding wavetable to 'audio/wav' file", () => {
  test("Sox should analyze the file wihout an error", async () => {
    const _freq = get(globalStore).BASE_FREQUENCY
    const samplerate = 44100
    const filepath = "/tmp/wavetable.wav"

    const table = generate_saw_tooth(samplerate)
    const buffer = IO.encode_wav(table, samplerate)

    await write(filepath, buffer)
    const { exitCode } = await $`sox --info ${filepath}`

    await $`rm ${filepath}`

    expect(exitCode).toBe(0)
  })
})
