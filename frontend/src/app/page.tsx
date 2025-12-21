'use client';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Link from 'next/link';
import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

export default function HomePage() {
	return (
		<Container maxWidth='lg'>
			<Box sx={{ my: 4 }}>
				<Typography variant='h3' component='h1' gutterBottom>
					Inventory Allocation System
				</Typography>
				<Typography variant='body1' color='text.secondary' paragraph>
					Manage your inventory and purchase requests efficiently
				</Typography>

				<Grid container spacing={3} sx={{ mt: 4 }}>
					<Grid size={{ xs: 12, md: 6 }}>
						<Card>
							<CardContent>
								<Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
									<InventoryIcon
										sx={{ fontSize: 40, color: 'primary.main', mr: 2 }}
									/>
									<Typography variant='h5'>Stock Management</Typography>
								</Box>
								<Typography variant='body2' color='text.secondary' paragraph>
									View and monitor stock levels across all warehouses. Track
									product quantities in real-time.
								</Typography>
								<Button
									variant='contained'
									component={Link}
									href='/stocks'
									fullWidth>
									View Stocks
								</Button>
							</CardContent>
						</Card>
					</Grid>

					<Grid size={{ xs: 12, md: 6 }}>
						<Card>
							<CardContent>
								<Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
									<ShoppingCartIcon
										sx={{ fontSize: 40, color: 'secondary.main', mr: 2 }}
									/>
									<Typography variant='h5'>Purchase Requests</Typography>
								</Box>
								<Typography variant='body2' color='text.secondary' paragraph>
									Create and manage purchase requests. Track orders from draft
									to completion.
								</Typography>
								<Button
									variant='contained'
									component={Link}
									href={'/purchase-requests'}
									fullWidth
									color='secondary'>
									View Purchase Requests
								</Button>
							</CardContent>
						</Card>
					</Grid>
				</Grid>
			</Box>
		</Container>
	);
}
