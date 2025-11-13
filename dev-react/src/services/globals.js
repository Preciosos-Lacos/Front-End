import * as bannerService from './bannerService';

// Attach helpers to window for existing files that expect global functions.
// This keeps changes minimal and makes the banner system local-first.
window.getBannerUrl = bannerService.getBannerUrl;
window.saveBannerUrl = bannerService.saveBannerUrl;
window.getBannerHistory = bannerService.getBannerHistory;
window.removeBannerFromHistory = bannerService.removeBannerFromHistory;
window.clearBannerHistory = bannerService.clearBannerHistory;
window.resetBanner = bannerService.resetBanner;
window.fileToBase64 = bannerService.fileToBase64;
window.uploadFile = bannerService.uploadFile;
window.syncBannerHistory = bannerService.syncBannerHistory;
window.formatSavedAt = bannerService.formatSavedAt;
window.getAuthToken = bannerService.getAuthToken;
window.isAuthenticated = bannerService.isAuthenticated;
window.isAdmin = bannerService.isAdmin;

export default bannerService;
