const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

const images = [
  { src: path.join(__dirname, '../public/logos/medicos.jpg'), maxWidth: 1600, quality: 80 },
  { src: path.join(__dirname, '../public/logos/logohospital.jpg'), maxWidth: 1200, quality: 80 }
]

async function optimize() {
  for (const img of images) {
    if (!fs.existsSync(img.src)) {
      console.warn(`Image not found: ${img.src}`)
      continue
    }
    const out = img.src // overwrite
    try {
      const metadata = await sharp(img.src).metadata()
      const width = Math.min(metadata.width || img.maxWidth, img.maxWidth)
      await sharp(img.src)
        .resize({ width })
        .jpeg({ quality: img.quality, mozjpeg: true })
        .toFile(out + '.tmp')
      await fs.promises.rename(out + '.tmp', out)
      console.log(`Optimized ${out} -> ${Math.round((await fs.promises.stat(out)).size / 1024)} KB`)
    } catch (err) {
      console.error(`Failed to optimize ${img.src}:`, err)
    }
  }
}

optimize().catch(err => console.error(err))
