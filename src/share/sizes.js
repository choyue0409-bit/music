// Output sizes for share images.
//
// 9:16 covers IG/Story-style placements (Stories, TikTok-vertical, Xiaohongshu
// vertical). 4:5 is the IG feed sweet spot. 1:1 is Weibo/WeChat Moments.

export const SIZES = [
  { id: 'story', w: 1080, h: 1920, label: '9:16', sub: '竖屏' },
  { id: 'feed',  w: 1080, h: 1350, label: '4:5',  sub: '社媒' },
  { id: 'square', w: 1080, h: 1080, label: '1:1', sub: '方形' },
]

export const DEFAULT_SIZE_ID = 'story'

export function findSize(id) {
  return SIZES.find((s) => s.id === id) || SIZES[0]
}

// Preview is a fixed width; height scales by aspect ratio.
export const PREVIEW_W = 320

export function previewScale(size) {
  return PREVIEW_W / size.w
}
