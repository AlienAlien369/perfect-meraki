const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const API_ROUTES = {
  USERS: {
    GET_ALL: `${BASE_URL}/api/users/getAllUsers`,
    DELETE: (userId: string) => `${BASE_URL}/api/users/delete/${userId}`,
    GET_BY_ID: (userId: string) =>
      `${BASE_URL}/api/users/getUserById/${userId}`,
  },
  ADMIN_USERS: {
    LIST: `${BASE_URL}/api/admin/users`,
    CREATE: `${BASE_URL}/api/admin/users`,
    UPDATE: (userId: string) => `${BASE_URL}/api/admin/users/${userId}`,
    DELETE: (userId: string) => `${BASE_URL}/api/admin/users/${userId}`,
  },
  DASHBOARD: `${BASE_URL}/api/admin/getAdminDashboardData`,
  PRODUCTS: {
    EDIT: (productId: string) => `${BASE_URL}/api/admin/editProduct/${productId}`,
    ADD: `${BASE_URL}/api/admin/createProduct`,
    DELETE: (productId: string) =>
      `${BASE_URL}/api/admin/deleteProduct/${productId}`,
    GET_BY_TYPE: `${BASE_URL}/api/admin/getProductsByType`,
  },
  WORKSHOPS: {
    ADD: `${BASE_URL}/api/admin/createWorkshop`,
    DELETE: (workshopId: string) =>
      `${BASE_URL}/api/admin/deleteWorkshop/${workshopId}`,
    EDIT: (workshopId: string) =>
      `${BASE_URL}/api/admin/updateWorkshop/${workshopId}`,
    GET_BY_TYPE: (workshop_type?: string) =>
      workshop_type
        ? `${BASE_URL}/api/admin/getWorkshopByType?type=${workshop_type}`
        : `${BASE_URL}/api/admin/getWorkshopByType`,
  },
  AUTH: {
    LOGIN: `${BASE_URL}/api/auth/login`,
    REGISTER: `${BASE_URL}/api/auth/register`,
    REFRESH: `${BASE_URL}/api/auth/refresh`,
    LOGOUT: `${BASE_URL}/api/auth/logout`,
  },
  CATALOGUE: {
    GET_BY_NAME: `${BASE_URL}/api/admin/getLinksByName`,
    CREATE: `${BASE_URL}/api/admin/createLinks`,
    UPDATE: `${BASE_URL}/api/admin/updateLinksByName`,
  },
};
