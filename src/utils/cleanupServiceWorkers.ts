// Type-safe cache clearing
const clearAllCaches = async (): Promise<void> => {
  if (!('caches' in window)) return;
  
  const cacheStorage = window.caches;
  const cacheNames = await cacheStorage.keys();
  await Promise.all(cacheNames.map(name => cacheStorage.delete(name)));
};

export const cleanupServiceWorkers = async (): Promise<boolean> => {
  if (!('serviceWorker' in navigator)) return false;

  try {
    // 1. Unregister service workers
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.map(reg => reg.unregister()));

    // 2. Clear caches using separate function
    await clearAllCaches();
    return true;
  } catch (error) {
    console.error('Cleanup failed:', error);
    return false;
  }
};

// Development auto-cleanup
if (process.env.NODE_ENV === 'development') {
  cleanupServiceWorkers().catch(() => {});
}
