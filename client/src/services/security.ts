import CryptoJS from 'crypto-js';

// A hardcoded secret for encrypting local keys (for BYOK local storage)
// In a real production app this could be user-derived, but for this PWA
// a static local key combined with localStorage is sufficient to prevent plain-text exposure.
const LOCAL_ENCRYPTION_KEY = 'Invoice2Sheet_PWA_Secure_Key_2026';

export const SecurityManager = {
  saveApiKey: (apiKey: string): void => {
    if (!apiKey) {
      localStorage.removeItem('VISION_API_KEY');
      return;
    }
    const encrypted = CryptoJS.AES.encrypt(apiKey, LOCAL_ENCRYPTION_KEY).toString();
    localStorage.setItem('VISION_API_KEY', encrypted);
  },

  getApiKey: (): string | null => {
    const encrypted = localStorage.getItem('VISION_API_KEY');
    if (!encrypted) return null;
    
    try {
      const bytes = CryptoJS.AES.decrypt(encrypted, LOCAL_ENCRYPTION_KEY);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (e) {
      console.error('Failed to decrypt API key');
      return null;
    }
  },

  hasApiKey: (): boolean => {
    return !!localStorage.getItem('VISION_API_KEY');
  }
};
