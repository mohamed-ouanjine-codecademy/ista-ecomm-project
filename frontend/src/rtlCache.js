// frontend/src/rtlCache.js
import createCache from '@emotion/cache';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';

export default function createRtlCache() {
  return createCache({
    key: 'muirtl', // any key is fine; 'muirtl' is common
    stylisPlugins: [rtlPlugin, prefixer],
  });
}
