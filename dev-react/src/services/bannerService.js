// Local banner service: stores banner and history in localStorage and provides
// safe fallbacks for upload/sync operations so the app works without a backend.

export const BANNER_KEY = 'home_banner_v1';
export const HISTORY_KEY = 'home_banner_history_v1';

export function getBannerUrl(defaultUrl = undefined) {
  try {
    const v = localStorage.getItem(BANNER_KEY);
    if (v) return v;
  } catch (e) {
    // ignore
  }
  return defaultUrl;
}

export function saveBannerUrl(url) {
  try {
    if (!url) return false;
    localStorage.setItem(BANNER_KEY, url);

    // update history (unique by url, newest first)
    const raw = localStorage.getItem(HISTORY_KEY);
    let arr = [];
    try { arr = raw ? JSON.parse(raw) : []; } catch (e) { arr = []; }
    // remove existing with same url
    arr = arr.filter((it) => it && it.url !== url);
    arr.unshift({ url, savedAt: new Date().toISOString() });
    localStorage.setItem(HISTORY_KEY, JSON.stringify(arr.slice(0, 50)));
    return true;
  } catch (e) {
    console.error('saveBannerUrl error', e);
    return false;
  }
}

export function getBannerHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch (e) {
    console.error('getBannerHistory error', e);
    return [];
  }
}

export function removeBannerFromHistory(url) {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return false;
    let arr = JSON.parse(raw);
    const newArr = arr.filter((it) => it && it.url !== url);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newArr));
    return true;
  } catch (e) {
    console.error('removeBannerFromHistory error', e);
    return false;
  }
}

export function clearBannerHistory() {
  try {
    localStorage.removeItem(HISTORY_KEY);
    return true;
  } catch (e) {
    console.error('clearBannerHistory error', e);
    return false;
  }
}

export function resetBanner() {
  try {
    localStorage.removeItem(BANNER_KEY);
    return true;
  } catch (e) {
    console.error('resetBanner error', e);
    return false;
  }
}

export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    if (!file) return resolve('');
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(file);
  });
}

// In local/offline mode, uploadFile will just return a data URL for previews.
// It accepts either (file) or (path, file) to be compatible with existing calls.
export async function uploadFile(arg1, arg2) {
  try {
    let file = null;
    if (arg2) file = arg2;
    else file = arg1;
    if (!file) return { url: '' };
    const data = await fileToBase64(file);
    // mimic a server response shape
    return { url: data, imagemUrl: data };
  } catch (e) {
    console.error('uploadFile fallback error', e);
    return { url: '' };
  }
}

// Sync is a no-op in local mode. Returns a resolved object for UI compatibility.
export async function syncBannerHistory(syncUrl, token) {
  console.warn('syncBannerHistory called in local-only mode. No network requests made.');
  return { ok: false, error: 'local-only mode' };
}

export function formatSavedAt(iso) {
  try {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleString();
  } catch (e) {
    return iso;
  }
}

// Simple auth helpers used by several components. They are local-only helpers
// and derive their behavior from the token stored in localStorage (if any).
export function getAuthToken() {
  try { return localStorage.getItem('token'); } catch { return null; }
}

export function decodeJwt(token) {
  try {
    const payload = token.split('.')[1];
    const json = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    return json || {};
  } catch (e) {
    return {};
  }
}

export function isAuthenticated() {
  const t = getAuthToken();
  return !!t;
}

export function isAdmin() {
  const t = getAuthToken();
  if (!t) return false;
  const payload = decodeJwt(t);
  const roles = payload?.roles || payload?.authorities || [];
  if (Array.isArray(roles) && (roles.includes('ROLE_ADMIN') || roles.includes('ADMIN'))) return true;
  // fallback: check an 'admin' boolean claim
  if (payload?.admin === true) return true;
  return false;
}
