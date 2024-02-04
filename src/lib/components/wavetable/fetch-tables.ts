import { IO } from "pkg/wavetable_synth"

export type WavetableCollection = {
  name: string
  tables: string[]
}

export async function fetchWavetableCollections(): Promise<WavetableCollection[]> {
  return fetch("/wavetables/tablemap.json")
    .then(res => res.json())
    .then(json => json as WavetableCollection[])
    .catch(() => [])
}

export async function fetchTable(collectionName: string, tableName: string): Promise<Float32Array> {
  const url = encodeURI(`/wavetables/${collectionName}/${tableName}.wav`)
  return fetch(url)
    .then(res => res.arrayBuffer())
    .then(buffer => IO.decode_wav(new Uint8Array(buffer), 2048))
    .catch(() => new Float32Array())
}
