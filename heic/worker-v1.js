// lib/heif.ts
async function decodeHeif(bytes, module, maxPixels) {
  const decoder = new module.HeifDecoder();
  let images = [];
  try {
    images = decoder.decode(bytes);
    if (!images.length || images.length > 128) throw Error("\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043F\u0440\u043E\u0447\u0438\u0442\u0430\u0442\u044C HEIC. \u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0434\u0440\u0443\u0433\u043E\u0439 \u0441\u043D\u0438\u043C\u043E\u043A \u0438 \u043F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u0435\u0449\u0451 \u0440\u0430\u0437.");
    const image = images.find((item) => item.is_primary()) ?? images[0];
    const width = image.get_width(), height = image.get_height();
    if (!Number.isSafeInteger(width) || !Number.isSafeInteger(height) || width <= 0 || height <= 0 || width * height > maxPixels)
      throw Error(`\u0423 \u0444\u043E\u0442\u043E \u0441\u043B\u0438\u0448\u043A\u043E\u043C \u043C\u043D\u043E\u0433\u043E \u043F\u0438\u043A\u0441\u0435\u043B\u0435\u0439. \u041F\u043E\u0434\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u044E\u0442\u0441\u044F \u0441\u043D\u0438\u043C\u043A\u0438 \u0434\u043E ${Math.floor(maxPixels / 1e6)} \u043C\u0435\u0433\u0430\u043F\u0438\u043A\u0441\u0435\u043B\u0435\u0439.`);
    const target = { width, height, data: new Uint8ClampedArray(width * height * 4) };
    return await new Promise((resolve, reject) => image.display(target, (result) => result ? resolve(result) : reject(Error("\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043F\u0440\u043E\u0447\u0438\u0442\u0430\u0442\u044C HEIC. \u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0434\u0440\u0443\u0433\u043E\u0439 \u0441\u043D\u0438\u043C\u043E\u043A \u0438 \u043F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u0435\u0449\u0451 \u0440\u0430\u0437."))));
  } finally {
    for (const image of images) image.free();
    if (decoder.decoder) module.heif_context_free(decoder.decoder);
    decoder.decoder = null;
  }
}

// lib/client/heic.worker.ts
self.onmessage = async (event) => {
  try {
    const url = new URL("./libheif-1.23.5.js", self.location.href);
    const { default: factory } = await import(
      /* webpackIgnore: true */
      /* @vite-ignore */
      url.href
    );
    const module = await factory({ print: () => {
    }, printErr: () => {
    } });
    const result = await decodeHeif(new Uint8Array(event.data.bytes), module, event.data.maxPixels);
    self.postMessage({ width: result.width, height: result.height, pixels: result.data.buffer }, { transfer: [result.data.buffer] });
  } catch (error) {
    self.postMessage({ error: error instanceof Error && error.message.startsWith("\u0423 \u0444\u043E\u0442\u043E \u0441\u043B\u0438\u0448\u043A\u043E\u043C \u043C\u043D\u043E\u0433\u043E \u043F\u0438\u043A\u0441\u0435\u043B\u0435\u0439") ? error.message : "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043F\u0440\u043E\u0447\u0438\u0442\u0430\u0442\u044C HEIC. \u041F\u0440\u043E\u0432\u0435\u0440\u044C\u0442\u0435 \u0441\u043E\u0435\u0434\u0438\u043D\u0435\u043D\u0438\u0435 \u0438\u043B\u0438 \u0432\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0434\u0440\u0443\u0433\u043E\u0439 \u0441\u043D\u0438\u043C\u043E\u043A \u0438 \u043F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u0435\u0449\u0451 \u0440\u0430\u0437." });
  }
};
