import AdmZip from 'adm-zip'
import { GameEngine } from 'types/enum'

export async function inferProjectType(gameFile: File): Promise<GameEngine> {
  const arrayBuffer = await gameFile.arrayBuffer()
  const view = new Uint8Array(arrayBuffer)
  const buffer = Buffer.alloc(arrayBuffer.byteLength)
  for (let i = 0; i < arrayBuffer.byteLength; i++) {
    buffer[i] = view[i]
  }
  const zip = new AdmZip(buffer)
  const entries = zip.getEntries()
  for (const ent of entries) {
    if (ent.name === 'world.mt') {
      return GameEngine.MINETEST
    }
    if (ent.name === 'RPG_RT.ini') {
      return GameEngine.RM2K3E
    }
    if (ent.name === 'index.html'|| ent.name === 'index.htm') {
      return GameEngine.HTML
    }
  }
  return GameEngine.DOWNLOADABLE
}
