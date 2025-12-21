'use client';

import { useState, useCallback } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useStocks } from '../../hooks/useStocks';
import StockTable from '../../components/stocks/StockTable';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';
import SearchBar from '../../components/common/SearchBar';
import Pagination from '../../components/common/Pagination';

export default function StocksPage() {
	const [page, setPage] = useState(1);
	const [search, setSearch] = useState('');

	const { stocks, loading, error, pagination } = useStocks({
		page,
		limit: 10,
		search,
	});

	const handleSearch = useCallback((query: string) => {
		setSearch(query);
		setPage(1);
	}, []);

	if (loading && stocks.length === 0) return <LoadingSpinner />;

	return (
		<Container maxWidth='lg'>
			<Box sx={{ my: 4 }}>
				<Typography variant='h4' component='h1' gutterBottom>
					Stock Dashboard
				</Typography>
				<Typography variant='body1' color='text.secondary' paragraph>
					Monitor stock levels across all warehouses
				</Typography>

				{error && <ErrorAlert error={error} />}

				<SearchBar
					onSearch={handleSearch}
					placeholder='Search by product name, SKU, or warehouse...'
				/>

				{loading && <Box sx={{ textAlign: 'center', py: 2 }}>Loading...</Box>}

				<StockTable stocks={stocks} />

				{pagination && (
					<Pagination
						page={page}
						totalPages={pagination.totalPages}
						total={pagination.total}
						onPageChange={setPage}
					/>
				)}
			</Box>
		</Container>
	);
}
