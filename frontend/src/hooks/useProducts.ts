import { useState, useEffect } from 'react';
import axios from 'axios';
import { productService } from '../services/productService';
import { Product } from '../types/product';

export const useProducts = () => {
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchProducts = async () => {
			try {
				setLoading(true);
				const response = await productService.getAll({ limit: 100 });
				setProducts(response.data);
				setError(null);
			} catch (err) {
				if (axios.isAxiosError(err)) {
					setError(err.message || 'Failed to fetch products');
				} else if (err instanceof Error) {
					setError(err.message);
				} else {
					setError('Failed to fetch products');
				}
			} finally {
				setLoading(false);
			}
		};

		fetchProducts();
	}, []);

	return { products, loading, error };
};
