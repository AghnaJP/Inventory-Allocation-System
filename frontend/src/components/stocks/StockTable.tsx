import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import { Stock } from '../../types/stock';
import { formatNumber } from '../../utils/formatters';

interface StockTableProps {
	stocks: Stock[];
}

export default function StockTable({ stocks }: StockTableProps) {
	if (stocks.length === 0) {
		return (
			<Paper sx={{ p: 3, textAlign: 'center' }}>
				<p>No stocks found</p>
			</Paper>
		);
	}

	return (
		<TableContainer component={Paper}>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>
							<strong>Product Name</strong>
						</TableCell>
						<TableCell>
							<strong>SKU</strong>
						</TableCell>
						<TableCell>
							<strong>Warehouse</strong>
						</TableCell>
						<TableCell align='right'>
							<strong>Quantity</strong>
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{stocks.map((stock) => (
						<TableRow key={stock.id} hover>
							<TableCell>{stock.product.name}</TableCell>
							<TableCell>
								<Chip
									label={stock.product.sku}
									size='small'
									variant='outlined'
								/>
							</TableCell>
							<TableCell>{stock.warehouse.name}</TableCell>
							<TableCell align='right'>
								<Chip
									label={formatNumber(stock.quantity)}
									color={stock.quantity > 0 ? 'success' : 'default'}
									size='small'
								/>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}
