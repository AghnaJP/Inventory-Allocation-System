import { useState, useEffect } from 'react';
import axios from 'axios';
import { warehouseService } from '../services/warehouseService';
import { Warehouse } from '../types/warehouse';

export const useWarehouses = () => {
	const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchWarehouses = async () => {
			try {
				setLoading(true);
				const data = await warehouseService.getAll();
				setWarehouses(data);
				setError(null);
			} catch (err) {
				if (axios.isAxiosError(err)) {
					setError(err.message || 'Failed to fetch warehouses');
				} else if (err instanceof Error) {
					setError(err.message);
				} else {
					setError('Failed to fetch warehouses');
				}
			} finally {
				setLoading(false);
			}
		};

		fetchWarehouses();
	}, []);

	return { warehouses, loading, error };
};
