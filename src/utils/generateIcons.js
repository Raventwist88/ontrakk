// This is a temporary solution to generate placeholder icons
// You should replace these with proper icons later

function createCanvas(size) {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  return canvas
}

function drawIcon(size) {
  const canvas = createCanvas(size)
  const ctx = canvas.getContext('2d')

  // Background
  ctx.fillStyle = '#3B82F6' // blue-500
  ctx.fillRect(0, 0, size, size)

  // Text
  ctx.fillStyle = '#FFFFFF'
  ctx.font = `bold ${size/4}px Arial`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('OT', size/2, size/2)

  return canvas.toDataURL()
}

export function generateIcons() {
  // Generate icons
  const icon192 = drawIcon(192)
  const icon512 = drawIcon(512)

  // Create download links
  const sizes = [
    { name: 'icon-192.png', data: icon192 },
    { name: 'icon-512.png', data: icon512 }
  ]

  sizes.forEach(({ name, data }) => {
    const link = document.createElement('a')
    link.download = name
    link.href = data
    link.click()
  })
} 