import React, { useState, useEffect, useCallback } from "react";
import CategoryApi from "../../api/CategoryApi.jsx";
import ProductApi from "../../api/ProductApi.jsx";
import UserApi from "../../api/UserApi.jsx";
import AddCategoryModal from "./AddCategoryModel.jsx";
import AddProductModal from "./AddProductModel.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";

// Import the new components
import AdminLayout from "./AdminLayout.jsx";
import AdminOverview from "./AdminOverview.jsx";
import AdminProducts from "./AdminProducts.jsx";
import AdminCategories from "./AdminCategories.jsx";
import AdminCustomers from "./AdminCustomers.jsx";
import AdminOrders from "./AdminOrders.jsx";
import AdminSettings from "./AdminSettings.jsx";

function AdminDashboard() {
  const { user } = useAuth();
  const toast = useToast();
  
  const [activeTab, setActiveTab] = useState("overview");
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [realUsers, setRealUsers] = useState([]);
  const [fakeUsers, setFakeUsers] = useState(() => {
    try {
      const local = localStorage.getItem("crm_dummy_users");
      if (local) return JSON.parse(local);
    } catch {}
    return [
      { id: 9991, username: "Sardor Toshmatov",   role: "customer" },
      { id: 9992, username: "Malika Yusupova",     role: "customer" },
      { id: 9993, username: "Bobur Rahimov",       role: "customer" },
      { id: 9994, username: "Nilufar Hasanova",    role: "customer" },
      { id: 9995, username: "Jasur Karimov",       role: "customer" },
      { id: 9996, username: "Sitora Mirzayeva",    role: "customer" },
      { id: 9997, username: "Otabek Xolmatov",     role: "customer" },
      { id: 9998, username: "Zulfiya Abdullayeva", role: "customer" },
      { id: 9999, username: "Sherzod Normatov",    role: "customer" },
      { id: 9000, username: "Barno Qodirov",       role: "customer" },
      { id: 8991, username: "Ulugbek Salimov",     role: "customer" },
      { id: 8992, username: "Mohira Tursunova",    role: "customer" },
      { id: 8993, username: "Doniyor Ergashev",    role: "customer" },
      { id: 8994, username: "Feruza Nazarova",     role: "customer" },
      { id: 8995, username: "Akbar Hamidov",       role: "customer" },
      { id: 8996, username: "Gulnora Yunusova",    role: "customer" },
      { id: 8997, username: "Bahrom Qosimov",      role: "customer" },
      { id: 8998, username: "Dilnoza Raxmanova",   role: "customer" },
      { id: 8999, username: "Timur Bekmurodov",    role: "customer" },
      { id: 8000, username: "Sarvar Ismoilov",     role: "customer" },
      { id: 7991, username: "Nozima Xoliqova",     role: "customer" },
      { id: 7992, username: "Behruz Azimov",       role: "customer" },
      { id: 7993, username: "Kamola Mansurova",    role: "customer" },
      { id: 7994, username: "Rustam Yoqubov",      role: "customer" },
      { id: 7995, username: "Maftuna Sobirov",     role: "customer" },
    ];
  });
  
  const users = [...realUsers, ...fakeUsers];
  const [loading, setLoading] = useState(true);
  
  const [catModal, setCatModal] = useState(false);
  const [prodModal, setProdModal] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const [catRes, prodRes] = await Promise.all([
        CategoryApi.fetchCategory(),
        ProductApi.fetchAllProducts(),
      ]);
      setCategories(catRes.data || []);
      setProducts(prodRes.data || []);
    } catch (err) {
      console.error("Failed to load catalogue:", err);
    }
    try {
      const userRes = await UserApi.listUsers();
      setRealUsers(userRes.data || []);
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const handleAction = (action) => {
    switch (action) {
      case "addCategory": setCatModal(true); break;
      case "addProduct": setProdModal(true); break;
      case "viewProducts": setActiveTab("products"); break;
      case "viewCustomers": setActiveTab("customers"); break;
      case "viewOrders": setActiveTab("orders"); break;
      default: break;
    }
  };

  return (
    <>
      <AdminLayout activeTab={activeTab} onTabChange={setActiveTab} user={user}>
        {activeTab === "overview" && (
          <AdminOverview
            products={products}
            categories={categories}
            users={users}
            loading={loading}
            onAction={handleAction}
          />
        )}
        
        {activeTab === "products" && (
          <AdminProducts
            products={products}
            categories={categories}
            loading={loading}
            onAddProduct={() => setCatModal(false) || setProdModal(true)}
            onRefresh={refresh}
            toast={toast}
          />
        )}
        
        {activeTab === "categories" && (
          <AdminCategories
            categories={categories}
            products={products}
            loading={loading}
            onAddCategory={() => setProdModal(false) || setCatModal(true)}
            onRefresh={refresh}
            toast={toast}
          />
        )}

        {activeTab === "customers" && (
          <AdminCustomers
            users={users}
            loading={loading}
            onAddFakeUser={() => {
              const newFake = {
                id: 9000 + Math.floor(Math.random() * 900),
                username: `Yangi Mijoz ${Math.floor(Math.random() * 100)}`,
                role: "customer"
              };
              const updated = [newFake, ...fakeUsers];
              setFakeUsers(updated);
              localStorage.setItem("crm_dummy_users", JSON.stringify(updated));
            }}
          />
        )}

        {activeTab === "orders" && (
          <AdminOrders />
        )}

        {activeTab === "settings" && (
          <AdminSettings />
        )}
      </AdminLayout>

      <AddCategoryModal isOpen={catModal} onClose={() => setCatModal(false)} onSuccess={refresh} />
      <AddProductModal isOpen={prodModal} onClose={() => setProdModal(false)} onSuccess={refresh} />
    </>
  );
}

export default AdminDashboard;
