export const isAuthenticated = (): boolean => {
    return !!localStorage.getItem('token'); // Replace with real auth logic
  };
  
  export const getUserRole = (): string => {
    return localStorage.getItem('role') || ''; // Replace with real user role fetching logic
  };
  