export interface CategoryStyle {
  color: string;  
  bg: string;      
  icon: string;    
}

export const CATEGORY_STYLE_BY_NAME: Record<string, CategoryStyle> = {
  'таксі':      { color: '#664d03', bg: '#fff3cd', icon: '🚕' },
  'їжа':        { color: '#581845', bg: '#fde2ff', icon: '🍔' },
  'здоровʼя':   { color: '#14532d', bg: '#d1e7dd', icon: '🩺' },
  'транспорт':  { color: '#084298', bg: '#cfe2ff', icon: '🚌' },
  'комуналка':  { color: '#b02a37', bg: '#f8d7da', icon: '💡' },
  'зарплата':   { color: '#0a3622', bg: '#d1e7dd', icon: '💸' },
};