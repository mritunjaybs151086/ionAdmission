export interface RouteConfig {
  path: string;
  name: string;
  component: string;
  icon?: string; // Optional, if not all routes have an icon
  isProtected: boolean; // Marks the route as protected
  permissions?: string[]; // Optional permissions array
  submenu?: RouteConfig[]; // Nested submenu routes
}
