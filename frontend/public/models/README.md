# Product 3D models

Place genuine, optimized `.glb` or `.gltf` jewellery model files in this directory. No sample model is bundled, so existing product photos remain the default until a real model is assigned.

For a product, set the optional `modelUrl` property to its public path, for example `/models/gold-ring.glb`. The field is part of the Product schema and is returned by the existing product API; products that omit it keep the current image gallery. For externally hosted models, set `modelUrl` to the complete HTTPS URL and allow that host to serve cross-origin model and texture files.

To add a model:

1. Export the ring, necklace, earrings, or bangles as glTF Binary (`.glb`) where possible. Apply transforms, use physically based materials, embed textures, and keep texture dimensions and polygon count appropriate for mobile.
2. Copy the file into `frontend/public/models/` with a descriptive name, such as `gold-ring.glb` or `bridal-necklace.glb`.
3. In **Admin → Products**, add or edit the product and enter `/models/gold-ring.glb` in the optional 3D Model URL field. The same `modelUrl` property is accepted by the product create/update API.
4. Open its product page and check rotation, zoom, reset, and the photo fallback after removing or mistyping the model path.

The backend admin product create/update endpoints accept the optional field through their existing product payload. Keep model files optimized; very large textures increase initial load time on the product page.
