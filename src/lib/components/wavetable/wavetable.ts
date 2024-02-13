import { IO, generate_saw_tooth } from "pkg/wavetable_synth"
import { writable } from "svelte/store"
import tableMap from "src/assets/wavetables/tablemap.yaml"
import { globalStore } from "src/lib/stores/global"

export type WavetableStore = {
  buffer: Float32Array
  name: string
  frame: number
}

export type WavetableCollection = {
  name: string
  tables: string[]
}

function createWavetableStore() {
  const bufferStore = writable<Float32Array>(generate_saw_tooth(2048))
  const nameStore = writable<string>("Init")
  const frameStore = writable<number>(1)

  const tableCache = new Map<string, Float32Array>()
  let cachedFrameCount = 1

  const tableCount = (tableMap as WavetableCollection[]).reduce(
    (sum, collection) => sum + collection.tables.length,
    0
  )

  function getTable(input: number): [string | undefined, string | undefined] {
    let i = input

    const colmap = tableMap as WavetableCollection[]
    for (const collection of colmap) {
      i -= collection.tables.length

      if (i < 0) {
        i += collection.tables.length
        return [collection.name, collection.tables[i]]
      }
    }

    return [undefined, undefined]
  }

  let stockTableIndex = -1

  function next() {
    if (++stockTableIndex > tableCount) stockTableIndex = 0

    try {
      const [collectionName, tableName] = getNamesFromIndex(stockTableIndex)
      setStockTable(collectionName, tableName).catch(console.error)
    } catch (e) {
      console.error(e)
    }
  }

  function prev() {
    if (--stockTableIndex < 0) stockTableIndex = tableCount - 1

    try {
      const [collectionName, tableName] = getNamesFromIndex(stockTableIndex)
      setStockTable(collectionName, tableName).catch(console.error)
    } catch (e) {
      console.error(e)
    }
  }

  async function setStockTable(collectionName: string, tableName: string) {
    const buffer = await fetchTable(collectionName, tableName)

    bufferStore.set(buffer)
    nameStore.set(tableName)

    recalculateFrame(buffer)
  }

  function setTable(name: string, buffer: Float32Array) {
    bufferStore.set(buffer)
    nameStore.set(name)

    recalculateFrame(buffer)
  }

  function recalculateFrame(buffer: Float32Array) {
    const frameCount = Math.floor(buffer.length / globalStore.windowSize)
    frameStore.update(frame => Math.floor(((frame - 1) * frameCount) / cachedFrameCount) + 1)

    cachedFrameCount = frameCount
  }

  function getNamesFromIndex(index: number) {
    const [collectionName, tableName] = getTable(index)
    if (!tableName || !collectionName)
      throw Error(`No table, nor collection found for index: ${index}`)

    return [collectionName, tableName] as [string, string]
  }
  async function fetchTable(collectionName: string, tableName: string): Promise<Float32Array> {
    const hash = `${collectionName}:${tableName}`

    if (tableCache.has(hash)) {
      console.log(`Cache hit for: (${hash})`)
      // biome-ignore lint/style/noNonNullAssertion:
      return tableCache.get(hash)!
    }

    const url = encodeURI(`/wavetables/${collectionName}/${tableName}.wav`)
    return fetch(url)
      .then(res => res.arrayBuffer())
      .then(buffer => IO.decode_wav(new Uint8Array(buffer), 2048))
      .catch(() => new Float32Array())
  }

  return {
    bufferStore,
    nameStore,
    frameStore,
    next,
    prev,
    setStockTable,
    setTable,
    get tableMap() {
      return tableMap as WavetableCollection[]
    },
  }
}

export const wavetableStore = createWavetableStore()
