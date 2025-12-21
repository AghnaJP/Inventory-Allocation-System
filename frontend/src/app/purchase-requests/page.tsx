'use client';

import { useState, useMemo } from 'react'; // Added useMemo
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from 'next/link';
import AddIcon from '@mui/icons-material/Add';
import { usePurchaseRequests } from '../../hooks/usePurchaseRequests';
import PurchaseRequestTable from '../../components/purchase-requests/purchaseRequestTable';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';
import SearchBar from '../../components/common/SearchBar';
import Pagination from '../../components/common/Pagination';

export default function PurchaseRequestsPage() {
	const [page, setPage] = useState(1);
	const [search, setSearch] = useState('');

	const queryParams = useMemo(
		() => ({
			page,
			limit: 10,
			search,
		}),
		[page, search]
	);

	const { purchaseRequests, loading, error, pagination, refetch } =
		usePurchaseRequests(queryParams);

	const handleSearch = (query: string) => {
		setSearch(query);
		setPage(1);
	};

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
					<div>
						<Typography variant='h4' component='h1' gutterBottom>
							Purchase Requests
						</Typography>
						<Typography variant='body1' color='text.secondary'>
							Manage and track purchase orders
						</Typography>
					</div>
					<Button
						variant='contained'
						startIcon={<AddIcon />}
						component={Link}
						href='/purchase-requests/new'>
						New Request
					</Button>
				</Box>

				{error && <ErrorAlert error={error} />}

				<SearchBar
					onSearch={handleSearch}
					placeholder='Search by reference, vendor, or warehouse...'
				/>

				{loading ? (
					<Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
						<LoadingSpinner />
					</Box>
				) : (
					<>
						<PurchaseRequestTable
							purchaseRequests={purchaseRequests}
							onUpdate={refetch}
						/>

						{pagination && (
							<Pagination
								page={page}
								totalPages={pagination.totalPages}
								total={pagination.total}
								onPageChange={setPage}
							/>
						)}
					</>
				)}
			</Box>
		</Container>
	);
}
