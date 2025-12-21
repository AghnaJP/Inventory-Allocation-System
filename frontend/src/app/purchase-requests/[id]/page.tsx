'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Link from 'next/link';
import axios from 'axios';
import { usePurchaseRequest } from '../../../hooks/usePurchaseRequest';
import PurchaseRequestDetail from '../../../components/purchase-requests/PurchaseRequestDetail';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import ErrorAlert from '../../../components/common/ErrorAlert';
import { purchaseRequestService } from '../../../services/purchaseRequestService';

export default function PurchaseRequestDetailPage() {
	const params = useParams();
	const router = useRouter();
	const id = Number(params.id);
	const { purchaseRequest, loading, error } = usePurchaseRequest(id);
	const [deleting, setDeleting] = useState(false);

	const handleDelete = async () => {
		if (!purchaseRequest) return;

		if (purchaseRequest.status !== 'DRAFT') {
			alert('Can only delete purchase requests with DRAFT status');
			return;
		}

		if (!confirm('Are you sure you want to delete this purchase request?')) {
			return;
		}

		try {
			setDeleting(true);
			await purchaseRequestService.delete(id);
			router.push('/purchase-requests');
		} catch (err) {
			if (axios.isAxiosError(err)) {
				alert(err.response?.data?.error || 'Failed to delete purchase request');
			} else {
				alert('Failed to delete purchase request');
			}
			setDeleting(false);
		}
	};

	const handleUpdateStatus = async (status: string) => {
		if (!purchaseRequest) return;

		if (!confirm(`Are you sure you want to change status to ${status}?`)) {
			return;
		}

		try {
			await purchaseRequestService.update(id, {
				status: status as 'DRAFT' | 'PENDING' | 'COMPLETED' | 'REJECTED',
			});
			window.location.reload();
		} catch (err) {
			if (axios.isAxiosError(err)) {
				alert(err.response?.data?.error || 'Failed to update status');
			} else {
				alert('Failed to update status');
			}
		}
	};

	if (loading) return <LoadingSpinner />;
	if (error) return <ErrorAlert error={error} />;
	if (!purchaseRequest)
		return <ErrorAlert error='Purchase request not found' />;

	return (
		<Container maxWidth='lg'>
			<Box sx={{ my: 4 }}>
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						mb: 3,
					}}>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
						<Button
							startIcon={<ArrowBackIcon />}
							component={Link}
							href='/purchase-requests'>
							Back
						</Button>
						<Typography variant='h4' component='h1'>
							Purchase Request Details
						</Typography>
					</Box>
					<Box sx={{ display: 'flex', gap: 1 }}>
						{purchaseRequest.status === 'DRAFT' && (
							<>
								<Button
									variant='outlined'
									startIcon={<EditIcon />}
									component={Link}
									href={`/purchase-requests/${id}/edit`}>
									Edit
								</Button>
								<Button
									variant='outlined'
									color='error'
									startIcon={<DeleteIcon />}
									onClick={handleDelete}
									disabled={deleting}>
									Delete
								</Button>
								<Button
									variant='contained'
									onClick={() => handleUpdateStatus('PENDING')}>
									Submit to Pending
								</Button>
							</>
						)}
					</Box>
				</Box>

				<PurchaseRequestDetail purchaseRequest={purchaseRequest} />
			</Box>
		</Container>
	);
}
