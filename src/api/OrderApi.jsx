import api from "./ApiService.jsx";

const OrderApi = {
  placeOrder: (orderData) => api.post("/api/v1/order_status/place-order/", orderData),
  getOrderStatus: (orderId) => api.get(`/api/v1/order_status/order-status/${orderId}`),
};

export default OrderApi;
