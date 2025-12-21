import { useRouter } from 'next/navigation';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { PurchaseRequest } from '../../types/purchaseRequest';
import {
	formatDate,
	formatNumber,
	getStatusColor,
} from '../../utils/formatters';
import { purchaseRequestService } from '../../services/purchaseRequestService';
import { useState } from 'react';
import axios from 'axios';

interface PurchaseRequestTableProps {
	purchaseRequests: PurchaseRequest[];
	onUpdate: () => void;
}

export default function PurchaseRequestTable({
	purchaseRequests,
	onUpdate,
}: PurchaseRequestTableProps) {
	const router = useRouter();
	const [deleting, setDeleting] = useState<number | null>(null);

	const handleDelete = async (id: number, status: string) => {
		if (status !== 'DRAFT') {
			alert('Can only delete purchase requests with DRAFT status');
			return;
		}

		if (!confirm('Are you sure you want to delete this purchase request?')) {
			return;
		}

		try {
			setDeleting(id);
			await purchaseRequestService.delete(id);
			onUpdate();
		} catch (error) {
			if (axios.isAxiosError(error)) {
				alert(
					error.response?.data?.error || 'Failed to delete purchase request'
				);
			} else {
				alert('Failed to delete purchase request');
			}
		} finally {
			setDeleting(null);
		}
	};

	const getTotalQuantity = (pr: PurchaseRequest) => {
		return pr.items.reduce((sum, item) => sum + item.quantity, 0);
	};

	if (purchaseRequests.length === 0) {
		return (
			<Paper sx={{ p: 3, textAlign: 'center' }}>
				<p>No purchase requests found</p>
			</Paper>
		);
	}

	return (
		<TableContainer component={Paper}>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>
							<strong>Reference</strong>
						</TableCell>
						<TableCell>
							<strong>Vendor</strong>
						</TableCell>
						<TableCell>
							<strong>Warehouse</strong>
						</TableCell>
						<TableCell align='right'>
							<strong>Total Qty</strong>
						</TableCell>
						<TableCell>
							<strong>Status</strong>
						</TableCell>
						<TableCell>
							<strong>Created</strong>
						</TableCell>
						<TableCell align='center'>
							<strong>Actions</strong>
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{purchaseRequests.map((pr) => (
						<TableRow key={pr.id} hover>
							<TableCell>
								<Chip label={pr.reference} color='primary' size='small' />
							</TableCell>
							<TableCell>{pr.vendor || '-'}</TableCell>
							<TableCell>{pr.warehouse?.name || '-'}</TableCell>
							<TableCell align='right'>
								{formatNumber(getTotalQuantity(pr))}
							</TableCell>
							<TableCell>
								<Chip
									label={pr.status}
									color={getStatusColor(pr.status)}
									size='small'
								/>
							</TableCell>
							<TableCell>{formatDate(pr.createdAt)}</TableCell>
							<TableCell align='center'>
								<Tooltip title='View'>
									<IconButton
										size='small'
										onClick={() => router.push(`/purchase-requests/${pr.id}`)}>
										<VisibilityIcon fontSize='small' />
									</IconButton>
								</Tooltip>
								{pr.status === 'DRAFT' && (
									<>
										<Tooltip title='Edit'>
											<IconButton
												size='small'
												onClick={() =>
													router.push(`/purchase-requests/${pr.id}/edit`)
												}>
												<EditIcon fontSize='small' />
											</IconButton>
										</Tooltip>
										<Tooltip title='Delete'>
											<IconButton
												size='small'
												onClick={() => handleDelete(pr.id, pr.status)}
												disabled={deleting === pr.id}>
												<DeleteIcon fontSize='small' />
											</IconButton>
										</Tooltip>
									</>
								)}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}
