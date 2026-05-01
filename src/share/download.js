// Wrap html-to-image with the bits we always want:
// - wait for Google Fonts to finish loading before snapshotting
// - cacheBust so SVG data URLs resolve fresh
// - pixelRatio 1 because the template already renders at the target pixel
//   size; doubling would produce 4× files for no extra fidelity.

import { toPng } from 'html-to-image'

export async function downloadAsPng(node, filename) {
  if (!node) throw new Error('downloadAsPng: missing node')

  if (document.fonts && document.fonts.ready) {
    await document.fonts.ready
  }

  const dataUrl = await toPng(node, {
    pixelRatio: 1,
    cacheBust: true,
    skipFonts: false,
    backgroundColor: undefined,
  })

  const safe = filename.replace(/[^\w.\-一-龥]+/g, '_')
  const a = document.createElement('a')
  a.href = dataUrl
  a.download = safe.endsWith('.png') ? safe : `${safe}.png`
  document.body.appendChild(a)
  a.click()
  a.remove()

  return dataUrl
}

export function buildFilename(parts) {
  const stamp = parts.filter(Boolean).join('-')
  return `iwasthere-${stamp}`
}
