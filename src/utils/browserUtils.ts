export const isFirefox = () => 
  navigator.userAgent.toLowerCase().includes('firefox');

export const checkWebGLSupport = () => {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext && 
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch (e) {
    return false;
  }
};
