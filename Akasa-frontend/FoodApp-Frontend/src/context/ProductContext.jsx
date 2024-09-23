import { createContext, useContext, useEffect, useState } from "react";
import productService from "../services/product.service";
import { toast } from 'react-hot-toast';

const ProductContext = createContext();

const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    
    useEffect(() => {
        setIsLoading(true);
        const fetchProducts = async () => {
            try {
                const response = await productService.getProducts(page);
                setProducts(response.data);
                setFilteredProducts(response.data);
            } catch (error) {
                toast.error("Failed to load products");
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, [page]);

    const getProductByCategory = async (category) => {
        setIsLoading(true);
        try {
            const response = await productService.getProductsByCategory(category);
            setProducts(response.data);
            setFilteredProducts(response.data); 
        } catch (error) {
            toast.error("Failed to load products by category");
        } finally {
            setIsLoading(false);
        }
    };

    const getProductsByName = (query) => {
        if (!query.trim()) {
            setFilteredProducts(products); 
            return;
        }
        const filtered = products.filter(product =>
            product.name.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredProducts(filtered);
    };

    return (
        <ProductContext.Provider
            value={{
                products,
                filteredProducts,
                setProducts,
                isLoading,
                setIsLoading,
                page,
                setPage,
                getProductByCategory,
                getProductsByName,
            }}
        >
            {children}
        </ProductContext.Provider>
    );
};

const useProduct = () => {
    const context = useContext(ProductContext);
    if (context === undefined) {
        throw new Error("useProduct must be used within a ProductProvider");
    }
    return context;
};

export { ProductProvider, useProduct };
