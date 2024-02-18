import { decodeBuffer } from "src/lib/utils/buffer"
import { generate_saw_tooth } from "pkg/wavetable_synth"
import { globalConsts } from "src/lib/stores/constants"
import { writable } from "svelte/store"

const wavetableCollections = require("src/assets/wavetables/tablemap.yaml") as WavetableCollection[]

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
  let stockTableIndex = -1

  const tableCount = wavetableCollections.reduce(
    (sum, collection) => sum + collection.tables.length,
    0
  )

  const getTableFromIndex = (input: number): [string | undefined, string | undefined] => {
    let i = input
    const collectionMap = wavetableCollections

    for (const collection of collectionMap) {
      i -= collection.tables.length

      if (i < 0) {
        i += collection.tables.length
        return [collection.name, collection.tables[i]]
      }
    }

    return [undefined, undefined]
  }

  const getIndexFromTable = (collectionName: string, tableName: string) => {
    let i = 0
    for (const collection of wavetableCollections) {
      if (collection.name !== collectionName) {
        i += collection.tables.length
        continue
      }

      return i + collection.tables.indexOf(tableName)
    }

    return -1
  }

  const getNamesFromIndex = (index: number): [string, string] => {
    const [collectionName, tableName] = getTableFromIndex(index)
    if (!tableName || !collectionName)
      throw Error(`No table, nor collection found for index: ${index}`)
    return [collectionName, tableName] as [string, string]
  }

  const changeStockTableIndex = (delta: number) => {
    stockTableIndex += delta
    if (stockTableIndex >= tableCount) {
      stockTableIndex = 0
    } else if (stockTableIndex < 0) {
      stockTableIndex = tableCount - 1
    }
  }

  const updateTableAndFrame = () => {
    const [collectionName, tableName] = getNamesFromIndex(stockTableIndex)
    setStockTable(collectionName, tableName).catch(console.error)
  }

  const setStockTable = async (collectionName: string, tableName: string) => {
    const buffer = await fetchStockTable(collectionName, tableName)
    const newIndex = getIndexFromTable(collectionName, tableName)
    if (newIndex >= 0) stockTableIndex = newIndex

    bufferStore.set(buffer)
    nameStore.set(tableName)
    recalculateFrame(buffer)
  }

  const recalculateFrame = (buffer: Float32Array) => {
    const frameCount = Math.floor(buffer.length / globalConsts.windowSize)
    if (frameCount === cachedFrameCount) return
    frameStore.update(frame => Math.floor(((frame - 1) * frameCount) / cachedFrameCount) + 1)
    cachedFrameCount = frameCount
  }

  const fetchStockTable = async (
    collectionName: string,
    tableName: string
  ): Promise<Float32Array> => {
    const hash = `${collectionName}:${tableName}`

    if (tableCache.has(hash)) {
      console.log(`Cache hit for: (${hash})`)
      // biome-ignore lint/style/noNonNullAssertion:
      return tableCache.get(hash)!
    }

    const url = encodeURI(`/wavetables/${collectionName}/${tableName}.wav`)
    return fetch(url)
      .then(res => res.arrayBuffer())
      .then(buffer => decodeBuffer(globalConsts.audioContext, buffer))
      .catch(() => new Float32Array())
  }

  return {
    bufferStore,
    nameStore,
    frameStore,
    next() {
      changeStockTableIndex(1)
      updateTableAndFrame()
    },
    prev() {
      changeStockTableIndex(-1)
      updateTableAndFrame()
    },
    setStockTable,
    setTable(name: string, buffer: Float32Array) {
      bufferStore.set(buffer)
      nameStore.set(name)
      recalculateFrame(buffer)
    },
    get tableMap() {
      return wavetableCollections
    },
  }
}

export const wavetableStore = createWavetableStore()
