import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { PurchaseRequest } from '../../types/purchaseRequest';
import {
	formatDate,
	formatNumber,
	getStatusColor,
} from '../../utils/formatters';

interface PurchaseRequestDetailProps {
	purchaseRequest: PurchaseRequest;
}

export default function PurchaseRequestDetail({
	purchaseRequest,
}: PurchaseRequestDetailProps) {
	const getTotalQuantity = () => {
		return purchaseRequest.items.reduce((sum, item) => sum + item.quantity, 0);
	};

	return (
		<Paper sx={{ p: 3 }}>
			{/* Header Info */}
			<Grid container spacing={3}>
				<Grid size={{ xs: 12, md: 6 }}>
					<Box sx={{ mb: 2 }}>
						<Typography variant='caption' color='text.secondary'>
							Reference Number
						</Typography>
						<Typography variant='h6'>{purchaseRequest.reference}</Typography>
					</Box>
					<Box sx={{ mb: 2 }}>
						<Typography variant='caption' color='text.secondary'>
							Warehouse
						</Typography>
						<Typography variant='body1'>
							{purchaseRequest.warehouse.name}
						</Typography>
					</Box>
					<Box sx={{ mb: 2 }}>
						<Typography variant='caption' color='text.secondary'>
							Vendor
						</Typography>
						<Typography variant='body1'>
							{purchaseRequest.vendor || '-'}
						</Typography>
					</Box>
				</Grid>

				<Grid size={{ xs: 12, md: 6 }}>
					<Box sx={{ mb: 2 }}>
						<Typography variant='caption' color='text.secondary'>
							Status
						</Typography>
						<Box>
							<Chip
								label={purchaseRequest.status}
								color={getStatusColor(purchaseRequest.status)}
								sx={{ mt: 0.5 }}
							/>
						</Box>
					</Box>
					<Box sx={{ mb: 2 }}>
						<Typography variant='caption' color='text.secondary'>
							Created At
						</Typography>
						<Typography variant='body1'>
							{formatDate(purchaseRequest.createdAt)}
						</Typography>
					</Box>
					<Box sx={{ mb: 2 }}>
						<Typography variant='caption' color='text.secondary'>
							Total Quantity
						</Typography>
						<Typography variant='body1'>
							{formatNumber(getTotalQuantity())} items
						</Typography>
					</Box>
				</Grid>
			</Grid>

			<Divider sx={{ my: 3 }} />

			{/* Items Table */}
			<Typography variant='h6' gutterBottom>
				Items
			</Typography>
			<TableContainer>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>
								<strong>Product Name</strong>
							</TableCell>
							<TableCell>
								<strong>SKU</strong>
							</TableCell>
							<TableCell align='right'>
								<strong>Quantity</strong>
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{purchaseRequest.items.map((item) => (
							<TableRow key={item.id}>
								<TableCell>{item.product.name}</TableCell>
								<TableCell>
									<Chip
										label={item.product.sku}
										size='small'
										variant='outlined'
									/>
								</TableCell>
								<TableCell align='right'>
									{formatNumber(item.quantity)}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</Paper>
	);
}
