import axios from 'axios';
import { UUID } from 'crypto';

const api = axios.create({
    baseURL: "https://api-softwaresystem.onrender.com"
});

export const useApi = () => ({
    verifyToken: async (token: string) => { 
        try {
            const response = await api.get('/verifyToken', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return { success: true, data: response.data };
        } catch (err) {
            console.error("Erro ao verificar o token:", err);
            return { success: false, error: "Erro ao verificar o token. Por favor, tente novamente."};
        }
    },
    authenticateUser: async (email: string, password: string) => {
        try {
            const response = await api.post('/auth', { email, password });
            return { success: true, data: response.data };
        } catch (err) {
            console.error("Erro ao entrar na sua conta:", err);
            return { success: false, error: "Não foi possível logar. Por favor, tente novamente."};
        }
    },
    createCustomerCategory: async (name: string, description: string, customers: any[], token: string) => {
        try {
            const response = await api.post('/customercategory', { 
                name, description, customers,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return { success: true, data: response.data };
        } catch (err) {
            console.error("Erro ao criar o cliente:", err);
            return { success: false, error: "Não foi possível criar o cliente. Por favor, tente novamente."};
        }
    },
    getAllCustomerCategories: async (token: string) => {
        const response = await api.get('/customercategory', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    },
    getCustomerCategoryById: async (id: string | undefined, token: string) => {
        const response = await api.get(`/customercategory/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    },
    deleteCustomerCategoryById: async (id: string | undefined, token: string) => {
        const response = await api.delete(`/customercategory/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    },
    createCategory: async (name: string, description: string, products: any[], token: string) => {
        try {
            const response = await api.post('/category', { 
                name, description, products,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return { success: true, data: response.data };
        } catch (err) {
            console.error("Erro ao criar a categoria:", err);
            return { success: false, error: "Não foi possível criar a categoria. Por favor, tente novamente."};
        }
    },
    getAllCategories: async (token: string) => {
        const response = await api.get('/category', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    },
    getCategoryById: async (id: string | undefined, token: string) => {
        const response = await api.get(`/category/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    },
    deleteCategoryById: async (id: string | undefined, token: string) => {
        const response = await api.delete(`/category/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    },
    getAllCustomers: async (token: string) => { 
        const response = await api.get('/customer', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    },
    getCustomerById: async (id: string | undefined, token: string) => {
        const response = await api.get(`/customer/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    },
    getCustomersByCategory: async (id: string | undefined, token: string) => {
        const response = await api.get(`/customer/findcustomerbycategory/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    },    
    deleteCustomerById: async (id: string | undefined, token: string) => {
        const response = await api.delete(`/customer/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    },
    createCustomer: async (name: string, customer_category_id: string, email: string, cellphone1: string, cellphone2: string, note: string, token: string) => {
        try {
            const response = await api.post('/customer', {
                name,
                customercategory: {
                    customer_category_id
                },
                email,
                cellphone1,
                cellphone2,
                note
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return { success: true, data: response.data };
        } catch (err) {
            console.error("Erro ao criar o cliente:", err);
            return { success: false, error: "Não foi possível criar o cliente. Por favor, tente novamente."};
        }
    },
    getAllProducts: async (token: string) => {
        const response = await api.get('/product', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    },
    getProductById: async (id: string | undefined, token: string) => {
        const response = await api.get(`/product/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    },
    getProductsByCategory: async (id: string | undefined, token: string) => {
        const response = await api.get(`/product/findproductbycategory/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    },       
    createProduct: async (name: string, category_id: string, description: string, brand: string, stock: number, cost: number, price: number, token: string) => {
        try {
            const response = await api.post('/product', {
                name,
                description,                
                brand,
                stock,
                category: {
                    category_id
                },
                price,
                cost,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return { success: true, data: response.data };
        } catch (err) {
            console.error("Erro ao criar o cliente:", err);
            return { success: false, error: "Não foi possível criar o cliente. Por favor, tente novamente."};
        }
    },
    updateProduct: async (id: string, name: string, categoryName: string, category_id: string, description: string, brand: string, stock: number, cost: number, price: number, token: string) => {
        try {
            const response = await api.put(`/product/${id}`, {
                name,
                description,                
                brand,
                stock,
                category: {
                    category_id
                },
                categoryName,
                price,
                cost,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return { success: true, data: response.data };
        } catch (err) {
            console.error("Erro ao atualizar o produto:", err);
            return { success: false, error: "Não foi possível atualizar o produto. Por favor, tente novamente."};
        }
    },
    deleteProductById: async (id: string | undefined, token: string) => {
        const response = await api.delete(`/product/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    },
    getAllOrders: async (token: string) => {
        const response = await api.get('/order', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    }, 
    getOrderById: async (id: string | undefined, token: string) => {
        const response = await api.get(`/order/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    },    
    getOrdersByCustomer: async (id: string | undefined, token: string) => {
        const response = await api.get(`/order/findbycustomer/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    },    
    getOrdersByProduct: async (id: string | undefined, token: string) => {
        const response = await api.get(`/order/findbyorder/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    },
    createOrder: async (orderData: any, token: string) => {
        try {
            const response = await api.post('/order', orderData, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              return { success: true, data: response.data };
        } catch (err) {
            console.log("Erro ao criar o pedido", err);
            return { success: false, error: "Não foi possível criar o pedido. Por favor, tente novamente.", err };
        }
    },              
    deleteOrderById: async (id: string | undefined, token: string) => {
        const response = await api.delete(`/order/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    },
    createSale: async (customer_id: string, product_id: string, stock: number, token: string) => {
        try {
            const response = await api.post('/sale', {
                customer: {
                    customer_id
                },                
                product: {
                    product_id
                },
                stock: stock
            }, { 
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return { success: true, data: response.data };
        } catch (err) {
            console.error("Erro ao criar o cliente:", err);
            return { success: false, error: "Não foi possível criar o cliente. Por favor, tente novamente."};
        }
    },
    deleteSaleById: async (id: string | undefined, token: string) => {
        const response = await api.delete(`/sale/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    },
    getSalesByOrder: async (id: string | undefined, token: string) => {
        const response = await api.get(`/sale/findsalesbyorder/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    }, 
    getAllTransactions: async (token: string) => {
        const response = await api.get('/transaction', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    }, 
    getTransactionById: async (id: string | undefined, token: string) => {
        const response = await api.get(`/transaction/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    },
    createTransaction: async (name: string, status: boolean, totalValue: number, token: string) => {
        try {
            const response = await api.post('/transaction', { 
                name, status, totalValue,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return { success: true, data: response.data };
        } catch (err) {
            console.error("Erro ao criar a transação:", err);
            return { success: false, error: "Não foi possível criar a transação. Por favor, tente novamente."};
        }
    },
    deleteTransactionById: async (id: string | undefined, token: string) => {
        const response = await api.delete(`/transaction/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    },
});
 