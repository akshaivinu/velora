import { useState } from "react";
import { createProduct } from "../services/api";

const AdminPanel = () => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop",
        stock: 10,
        sizes: "S,M,L,XL",
        category: "Sneakers"
    });
    const [status, setStatus] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("Creating...");
        try {
            const productData = {
                ...formData,
                price: Number(formData.price),
                stock: Number(formData.stock),
                sizes: formData.sizes.split(",").map(s => s.trim())
            };
            await createProduct(productData);
            setStatus("Product created successfully!");
            setFormData({
                name: "",
                description: "",
                price: "",
                image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop",
                stock: 10,
                sizes: "S,M,L,XL",
                category: "Sneakers"
            });
        } catch (error) {
            setStatus("Error: " + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="container admin-panel">
            <h1 className="page-heading">Admin Panel</h1>
            <div className="admin-grid">
                <div className="admin-card">
                    <h2>Add New Product</h2>
                    <form onSubmit={handleSubmit} className="admin-form">
                        <div className="form-group">
                            <label>Product Name</label>
                            <input name="name" value={formData.name} onChange={handleChange} required placeholder="e.g. Nike Air Max" />
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} required placeholder="Product details..." />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Price ($)</label>
                                <input name="price" type="number" value={formData.price} onChange={handleChange} required placeholder="99.99" />
                            </div>
                            <div className="form-group">
                                <label>Stock</label>
                                <input name="stock" type="number" value={formData.stock} onChange={handleChange} required />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Category</label>
                                <input name="category" value={formData.category} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>Sizes (comma separated)</label>
                                <input name="sizes" value={formData.sizes} onChange={handleChange} required />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Image URL</label>
                            <input name="image" value={formData.image} onChange={handleChange} required />
                        </div>
                        <button type="submit" className="btn btn--primary">Create Product</button>
                        {status && <p className="status-msg">{status}</p>}
                    </form>
                </div>
            </div>

            <style>{`
                .admin-panel { margin-top: 2rem; margin-bottom: 4rem; }
                .admin-grid { display: grid; gap: 2rem; }
                .admin-card { background: #fff; padding: 2rem; border-radius: 1.5rem; box-shadow: 0 20px 40px rgba(0,0,0,0.05); }
                .admin-card h2 { margin-top: 0; margin-bottom: 1.5rem; font-size: 1.5rem; }
                .admin-form { display: flex; flex-direction: column; gap: 1.25rem; }
                .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
                .form-group label { font-size: 0.85rem; font-weight: 600; color: #555; }
                .form-group input, .form-group textarea { 
                    padding: 0.85rem 1rem; border: 1px solid #e1e1e6; border-radius: 0.75rem; background: #f9f9fd; font: inherit;
                }
                .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
                .status-msg { margin-top: 1rem; font-weight: 600; color: var(--brand); }
            `}</style>
        </div>
    );
};

export default AdminPanel;
