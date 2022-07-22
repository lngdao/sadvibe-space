const languageDetectorPlugin = {
  type: 'languageDetector',
  async: true,
  init: () => {},
  detect: (callback: (lang: string) => void) => {
    const lng = localStorage.getItem('lng');
    callback(!!lng ? lng : 'en');
  },
  cacheUserLanguage: (language: any) => {
    localStorage.setItem('lng', language);
  },
};

module.exports = { languageDetectorPlugin };
