import PocketBase from 'pocketbase';

// Create a single PocketBase instance for the entire application
const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL || 'http://127.0.0.1:8090');

export default pb;

// Auth helpers
export const isUserValid = () => {
  return pb.authStore.isValid;
};

export const getCurrentUser = () => {
  return pb.authStore.model;
};

export const login = async (username: string, password: string) => {
  return await pb.collection('users').authWithPassword(username, password);
};

export const logout = () => {
  pb.authStore.clear();
};

export const register = async (username: string, email: string, password: string, passwordConfirm: string) => {
  return await pb.collection('users').create({
    username,
    email,
    password,
    passwordConfirm,
  });
};

// Simple admin password check (for applications that don't need complex auth)
const ADMIN_PASSWORD = 'GENZCLANX';  // In production, this should be an env variable
export const checkAdminPassword = (password: string) => {
  return password === ADMIN_PASSWORD;
};