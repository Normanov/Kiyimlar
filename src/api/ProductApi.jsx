import api from "./ApiService.jsx";

const ProductApi = {
  fetchAllProducts: () => api.get("/api/v1/products/"),
  fetchProduct: (id) => api.get(`/api/v1/products/${id}`),
  createProduct: (productData) => api.post("/api/v1/products/", productData),
  updateProduct: (id, productData) => api.put(`/api/v1/products/${id}`, productData),
  deleteProduct: (id) => api.delete(`/api/v1/products/${id}`),
};

export default ProductApi;
