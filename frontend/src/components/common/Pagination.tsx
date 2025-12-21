'use client';

import MuiPagination from '@mui/material/Pagination';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface PaginationProps {
	page: number;
	totalPages: number;
	total: number;
	onPageChange: (page: number) => void;
}

export default function Pagination({
	page,
	totalPages,
	total,
	onPageChange,
}: PaginationProps) {
	return (
		<Box
			sx={{
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
				mt: 3,
			}}>
			<Typography variant='body2' color='text.secondary'>
				Total: {total} items
			</Typography>
			<MuiPagination
				count={totalPages}
				page={page}
				onChange={(_, value) => onPageChange(value)}
				color='primary'
			/>
		</Box>
	);
}
