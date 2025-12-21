import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { purchaseRequestService } from '../services/purchaseRequestService';
import { PurchaseRequest } from '../types/purchaseRequest';

interface UsePurchaseRequestsParams {
	page?: number;
	limit?: number;
	search?: string;
}

export const usePurchaseRequests = ({
	page = 1,
	limit = 10,
	search = '',
}: UsePurchaseRequestsParams = {}) => {
	const [purchaseRequests, setPurchaseRequests] = useState<PurchaseRequest[]>(
		[]
	);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [pagination, setPagination] = useState({
		total: 0,
		page: 1,
		limit: 10,
		totalPages: 0,
	});

	const fetchPurchaseRequests = useCallback(async () => {
		try {
			setLoading(true);
			const response = await purchaseRequestService.getAll({
				page,
				limit,
				search,
			});
			setPurchaseRequests(response.data);
			setPagination(response.pagination);
			setError(null);
		} catch (err) {
			if (axios.isAxiosError(err)) {
				setError(err.message || 'Failed to fetch purchase requests');
			} else {
				setError('Failed to fetch purchase requests');
			}
		} finally {
			setLoading(false);
		}
	}, [page, limit, search]);

	useEffect(() => {
		fetchPurchaseRequests();
	}, [fetchPurchaseRequests]);

	return {
		purchaseRequests,
		loading,
		error,
		pagination,
		refetch: fetchPurchaseRequests,
	};
};
