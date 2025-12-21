import { useState, useEffect } from 'react';
import axios from 'axios';
import { purchaseRequestService } from '../services/purchaseRequestService';
import { PurchaseRequest } from '../types/purchaseRequest';

export const usePurchaseRequest = (id: number | null) => {
	const [purchaseRequest, setPurchaseRequest] =
		useState<PurchaseRequest | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchPurchaseRequest = async () => {
		if (!id) {
			setLoading(false);
			return;
		}

		try {
			setLoading(true);
			const data = await purchaseRequestService.getById(id);
			setPurchaseRequest(data);
			setError(null);
		} catch (err) {
			if (axios.isAxiosError(err)) {
				setError(err.message || 'Failed to fetch purchase request');
			} else if (err instanceof Error) {
				setError(err.message);
			} else {
				setError('Failed to fetch purchase request');
			}
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchPurchaseRequest();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id]);

	return { purchaseRequest, loading, error, refetch: fetchPurchaseRequest };
};
