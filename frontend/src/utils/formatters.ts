import { format } from 'date-fns';

export const formatDate = (date: string): string => {
	return format(new Date(date), 'MMM dd, yyyy HH:mm');
};

export const formatNumber = (num: number): string => {
	return num.toLocaleString();
};

export const getStatusColor = (
	status: string
): 'default' | 'primary' | 'success' | 'error' | 'warning' => {
	switch (status) {
		case 'DRAFT':
			return 'default';
		case 'PENDING':
			return 'primary';
		case 'COMPLETED':
			return 'success';
		case 'REJECTED':
			return 'error';
		default:
			return 'default';
	}
};
