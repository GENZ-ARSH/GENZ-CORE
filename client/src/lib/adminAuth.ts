
const ADMIN_PASSWORD = 'GENZCLANX';

export const checkAdminPassword = (password: string): boolean => {
  return password === ADMIN_PASSWORD;
};

export const setAdminSession = () => {
  sessionStorage.setItem('isAdmin', 'true');
};

export const isAdminAuthenticated = (): boolean => {
  return sessionStorage.getItem('isAdmin') === 'true';
};

export const clearAdminSession = () => {
  sessionStorage.removeItem('isAdmin');
};
