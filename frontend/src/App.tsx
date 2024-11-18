import React from 'react';
import LoadingOverlay from "react-loading-overlay-ts";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/header';
import { AuthProvider, useAuth } from './context/AuthContext';
import routes from './routes.json';
import { RouteConfig } from './types/types';
import { useLoader } from './context/LoaderContext';

// Import components dynamically
import Home from './pages/Dashboard';
import Login from './pages/Login';
import Unauthorized from './pages/Unauthorized';
import Breadcrumb from './components/Breadcrumb';


const componentMap: { [key: string]: React.FC } = {
  Home,
  Login,
  Unauthorized
};


// Helper function to generate routes
const generateRoutes = (
  routes: RouteConfig[],
  isAuthenticated: boolean,
  permissions: string[]
) => {
  return routes.map((route) => {
    if (route.submenu && route.submenu.length > 0) {
      return route.submenu.map((sub) => {
        const SubComponent = componentMap[sub.component];
        if (sub.isProtected && !isAuthenticated) {
          return (
            <Route
              key={sub.path}
              path={sub.path}
              element={<Navigate to="/login" replace />}
            />
          );
        }
        if (
          sub.isProtected &&
          sub.permissions &&
          !sub.permissions.every((perm) => permissions.includes(perm))
        ) {
          return (
            <Route
              key={sub.path}
              path={sub.path}
              element={<Navigate to="/unauthorized" replace />}
            />
          );
        }
        return (
          <Route key={sub.path} path={sub.path} element={<SubComponent />} />
        );
      });
    }

    const Component = componentMap[route.component];
    if (route.isProtected && !isAuthenticated) {
      return (
        <Route
          key={route.path}
          path={route.path}
          element={<Navigate to="/login" replace />}
        />
      );
    }
    if (
      route.isProtected &&
      route.permissions &&
      !route.permissions.every((perm) => permissions.includes(perm))
    ) {
      return (
        <Route
          key={route.path}
          path={route.path}
          element={<Navigate to="/unauthorized" replace />}
        />
      );
    }
    return <Route key={route.path} path={route.path} element={<Component />} />;
  });
};


const App: React.FC = () => {
  const { isAuthenticated, permissions } = useAuth(); // Move `useAuth` here
  const { loading, loadingText } = useLoader();
  const typedRoutes = routes as RouteConfig[]; // Cast JSON to the correct type

  return (
    <LoadingOverlay active={loading} spinner text={loadingText}>
    <AuthProvider>
      <Router>
        <div className="flex h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <Header />
            <Breadcrumb />
            <main className="p-6 bg-gray-100 flex-1 overflow-y-auto">
              <Routes>
                {generateRoutes(typedRoutes, isAuthenticated, permissions)}
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </AuthProvider>
    </LoadingOverlay>
  );
};

export default App;
