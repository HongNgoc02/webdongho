const API_BASE_URL = 'http://localhost:8080/api';

// Helper function to handle API calls
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    // If response is not ok, throw error with message
    if (!response.ok) {
      // Handle validation errors
      if (data.data && typeof data.data === 'object') {
        const validationErrors = Object.values(data.data).join(', ');
        throw new Error(validationErrors || data.message || 'Có lỗi xảy ra');
      }
      throw new Error(data.message || 'Có lỗi xảy ra');
    }

    return data;
  } catch (error) {
    // If it's already an Error object, throw it as is
    if (error instanceof Error) {
      throw error;
    }
    // Otherwise, create a new Error
    throw new Error(error.message || 'Có lỗi xảy ra khi kết nối với server');
  }
};

// User API
export const userAPI = {
  // Đăng ký
  register: async (userData) => {
    return apiRequest('/users/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Đăng nhập
  login: async (email, password) => {
    return apiRequest('/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  // Lấy thông tin user
  getUserById: async (id) => {
    return apiRequest(`/users/${id}`);
  },

  // Cập nhật thông tin user
  updateUser: async (id, userData) => {
    return apiRequest(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  // Lấy tất cả users (Admin)
  getAllUsers: async () => {
    return apiRequest('/users');
  },

  // Tìm kiếm users (Admin)
  searchUsers: async (keyword) => {
    return apiRequest(`/users/search?keyword=${encodeURIComponent(keyword)}`);
  },

  // Xóa user (Admin)
  deleteUser: async (id) => {
    return apiRequest(`/users/${id}`, {
      method: 'DELETE',
    });
  },
};

// Product API
export const productAPI = {
  // Lấy danh sách sản phẩm
  getAllProducts: async () => {
    return apiRequest('/products');
  },

  // Lấy chi tiết sản phẩm
  getProductById: async (id) => {
    return apiRequest(`/products/${id}`);
  },

  // Lấy sản phẩm theo danh mục
  getProductsByCategory: async (categoryId) => {
    return apiRequest(`/products/category/${categoryId}`);
  },

  // Tìm kiếm sản phẩm
  searchProducts: async (keyword) => {
    return apiRequest(`/products/search?keyword=${encodeURIComponent(keyword)}`);
  },

  // Tạo sản phẩm mới (Admin)
  createProduct: async (productData) => {
    return apiRequest('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  },

  // Cập nhật sản phẩm (Admin)
  updateProduct: async (id, productData) => {
    return apiRequest(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  },

  // Xóa sản phẩm (Admin)
  deleteProduct: async (id) => {
    return apiRequest(`/products/${id}`, {
      method: 'DELETE',
    });
  },
};

// Category API
export const categoryAPI = {
  // Lấy danh sách danh mục
  getAllCategories: async () => {
    return apiRequest('/categories');
  },

  // Lấy chi tiết danh mục
  getCategoryById: async (id) => {
    return apiRequest(`/categories/${id}`);
  },

  // Tạo danh mục mới (Admin)
  createCategory: async (categoryData) => {
    return apiRequest('/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  },

  // Cập nhật danh mục (Admin)
  updateCategory: async (id, categoryData) => {
    return apiRequest(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    });
  },

  // Xóa danh mục (Admin)
  deleteCategory: async (id) => {
    return apiRequest(`/categories/${id}`, {
      method: 'DELETE',
    });
  },

  // Tìm kiếm danh mục
  searchCategories: async (keyword) => {
    return apiRequest(`/categories/search?keyword=${encodeURIComponent(keyword)}`);
  },
};

// Order API
export const orderAPI = {
  // Tạo đơn hàng (checkout)
  checkout: async (checkoutData) => {
    return apiRequest('/orders/checkout', {
      method: 'POST',
      body: JSON.stringify(checkoutData),
    });
  },

  // Lấy đơn hàng của user
  getOrdersByUserId: async (userId) => {
    return apiRequest(`/orders/user/${userId}`);
  },

  // Lấy chi tiết đơn hàng
  getOrderById: async (id) => {
    return apiRequest(`/orders/${id}`);
  },

  // Lấy tất cả đơn hàng (Admin)
  getAllOrders: async () => {
    return apiRequest('/orders');
  },

  // Cập nhật đơn hàng (Admin)
  updateOrder: async (id, orderData) => {
    return apiRequest(`/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(orderData),
    });
  },

  // Cập nhật số lượng sản phẩm trong đơn hàng (Admin)
  updateOrderItemQuantity: async (orderId, orderItemId, quantity) => {
    return apiRequest(`/orders/${orderId}/items/${orderItemId}?quantity=${quantity}`, {
      method: 'PUT',
    });
  },

  // Tìm kiếm đơn hàng (Admin)
  searchOrders: async (keyword) => {
    return apiRequest(`/orders/search?keyword=${encodeURIComponent(keyword)}`);
  },

  // Xóa đơn hàng (Admin)
  deleteOrder: async (id) => {
    return apiRequest(`/orders/${id}`, {
      method: 'DELETE',
    });
  },
};

export default {
  userAPI,
  productAPI,
  categoryAPI,
  orderAPI,
};

