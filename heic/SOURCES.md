# Local HEIC decoder

libheif-js 1.23.5, LGPL-3.0: https://github.com/catdad-experiments/libheif-js/tree/d8ec4bc3bc5bf8055975577bccbbc7e1d7313c2d
Source and build scripts: https://github.com/catdad-experiments/libheif-js (npm version 1.23.5). Upstream libheif: https://github.com/strukturag/libheif. Included codec/library notices are in LICENSE.txt and LGPL-3.0.txt. The libheif-bundle.mjs module is copied unchanged and can be replaced independently of the application. Our worker is built from lib/client/heic.worker.ts and lib/heif.ts.

The module is loaded only for HEIC/HEIF that the browser cannot decode natively. It runs locally in a disposable worker; photographs are never sent to a conversion service. No runtime CDN requests.
