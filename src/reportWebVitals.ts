// Web Vitals reporting for performance monitoring
const reportWebVitals = (onPerfEntry?: (metric: any) => void) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    // Optional: enable web vitals reporting in production
    // import('web-vitals').then((webVitals) => {
    //   // Use webVitals here if needed
    // }).catch(() => {
    //   // Silently fail if web-vitals is not available
    // });
  }
};

export default reportWebVitals;
