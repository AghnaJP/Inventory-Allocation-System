import { useState, useEffect } from 'react';
import axios from 'axios';
import { stockService } from '../services/stockService';
import { Stock } from '../types/stock';

interface UseStocksParams {
	page?: number;
	limit?: number;
	search?: string;
}

export const useStocks = ({
	page = 1,
	limit = 10,
	search = '',
}: UseStocksParams = {}) => {
	const [stocks, setStocks] = useState<Stock[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [pagination, setPagination] = useState({
		total: 0,
		page: 1,
		limit: 10,
		totalPages: 0,
	});

	useEffect(() => {
		const fetchStocks = async () => {
			try {
				setLoading(true);
				const response = await stockService.getAll({ page, limit, search });
				setStocks(response.data);
				setPagination(response.pagination);
				setError(null);
			} catch (err) {
				if (axios.isAxiosError(err)) {
					setError(err.message || 'Failed to fetch stocks');
				} else if (err instanceof Error) {
					setError(err.message);
				} else {
					setError('Failed to fetch stocks');
				}
			} finally {
				setLoading(false);
			}
		};

		fetchStocks();
	}, [page, limit, search]);

	return { stocks, loading, error, pagination };
};
