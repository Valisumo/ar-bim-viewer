const { GLTFLoader } = require('three/examples/jsm/loaders/GLTFLoader');
const { WebGLRenderer } = require('three');
const { PNG } = require('pngjs');
const sharp = require('sharp');

async function createThumbnail(glbBuffer) {
  // 1. Load GLB
  const loader = new GLTFLoader();
  const gltf = await loader.parseAsync(glbBuffer, null);
  
  // 2. Set up renderer
  const renderer = new WebGLRenderer({ antialias: true });
  renderer.setSize(512, 512);
  
  // 3. Render to buffer
  renderer.render(gltf.scene, camera);
  const pixels = new Uint8Array(512 * 512 * 4);
  renderer.readRenderTargetPixels(renderer.getRenderTarget(), 0, 0, 512, 512, pixels);
  
  // 4. Convert to JPEG
  return await sharp(pixels, { raw: { width: 512, height: 512, channels: 4 }})
    .jpeg({ quality: 80 })
    .toBuffer();
}

module.exports = { createThumbnail };
