import i18n from '@/i18n.js'

const requiredFields = (propertyName) => (value) => {
  if (value) return true;
  return i18n.global.t('required', { property: propertyName });
};

export default requiredFields;
