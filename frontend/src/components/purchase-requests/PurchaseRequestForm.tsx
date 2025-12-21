'use client';

import { useState } from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { useProducts } from '../../hooks/useProducts';
import { useWarehouses } from '../../hooks/useWarehouses';
import { PurchaseRequest } from '../../types/purchaseRequest';
import LoadingSpinner from '../../components/common/LoadingSpinner';

interface FormData {
	warehouse_id: number;
	vendor?: string;
	items: {
		product_id: number;
		quantity: number;
	}[];
}

interface PurchaseRequestFormProps {
	onSubmit: (data: FormData) => Promise<void>;
	initialData?: PurchaseRequest;
}

interface FormItem {
	product_id: number;
	quantity: number;
}

export default function PurchaseRequestForm({
	onSubmit,
	initialData,
}: PurchaseRequestFormProps) {
	const { products, loading: productsLoading } = useProducts();
	const { warehouses, loading: warehousesLoading } = useWarehouses();

	const [warehouseId, setWarehouseId] = useState<number>(
		initialData?.warehouse_id || 0
	);
	const [vendor, setVendor] = useState<string>(initialData?.vendor || '');
	const [items, setItems] = useState<FormItem[]>(
		initialData?.items.map((item) => ({
			product_id: item.product_id,
			quantity: item.quantity,
		})) || [{ product_id: 0, quantity: 1 }]
	);
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleAddItem = () => {
		setItems([...items, { product_id: 0, quantity: 1 }]);
	};

	const handleRemoveItem = (index: number) => {
		if (items.length === 1) return;
		setItems(items.filter((_, i) => i !== index));
	};

	const handleItemChange = (
		index: number,
		field: keyof FormItem,
		value: number
	) => {
		const newItems = [...items];
		newItems[index] = { ...newItems[index], [field]: value };
		setItems(newItems);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);

		// Validation
		if (!warehouseId) {
			setError('Please select a warehouse');
			return;
		}

		if (items.some((item) => !item.product_id || item.quantity <= 0)) {
			setError('Please fill in all items with valid quantities');
			return;
		}

		try {
			setSubmitting(true);
			await onSubmit({
				warehouse_id: warehouseId,
				vendor: vendor || undefined,
				items,
			});
		} catch (err) {
			if (axios.isAxiosError(err)) {
				setError(
					err.response?.data?.error ||
						err.message ||
						'Failed to save purchase request'
				);
			} else if (err instanceof Error) {
				setError(err.message);
			} else {
				setError('Failed to save purchase request');
			}
			setSubmitting(false);
		}
	};

	if (productsLoading || warehousesLoading) {
		return <LoadingSpinner />;
	}

	return (
		<Paper sx={{ p: 3 }}>
			<form onSubmit={handleSubmit}>
				{error && (
					<Alert severity='error' sx={{ mb: 2 }}>
						{error}
					</Alert>
				)}

				{/* Warehouse and Vendor */}
				<Grid container spacing={2} sx={{ mb: 3 }}>
					<Grid size={{ xs: 12, md: 6 }}>
						<FormControl fullWidth required>
							<InputLabel>Warehouse</InputLabel>
							<Select
								value={warehouseId}
								label='Warehouse'
								onChange={(e) => setWarehouseId(Number(e.target.value))}>
								<MenuItem value={0}>Select Warehouse</MenuItem>
								{warehouses.map((warehouse) => (
									<MenuItem key={warehouse.id} value={warehouse.id}>
										{warehouse.name}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Grid>
					<Grid size={{ xs: 12, md: 6 }}>
						<TextField
							fullWidth
							label='Vendor (Optional)'
							value={vendor}
							onChange={(e) => setVendor(e.target.value)}
							placeholder='e.g., PT FOOM LAB GLOBAL'
						/>
					</Grid>
				</Grid>

				<Divider sx={{ my: 3 }} />

				{/* Items */}
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						mb: 2,
					}}>
					<Typography variant='h6'>Items</Typography>
					<Button
						startIcon={<AddIcon />}
						onClick={handleAddItem}
						variant='outlined'
						size='small'>
						Add Item
					</Button>
				</Box>

				{items.map((item, index) => (
					<Box
						key={index}
						sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
						<Grid container spacing={2} alignItems='center'>
							<Grid size={{ xs: 12, md: 6 }}>
								<FormControl fullWidth required>
									<InputLabel>Product</InputLabel>
									<Select
										value={item.product_id}
										label='Product'
										onChange={(e) =>
											handleItemChange(
												index,
												'product_id',
												Number(e.target.value)
											)
										}>
										<MenuItem value={0}>Select Product</MenuItem>
										{products.map((product) => (
											<MenuItem key={product.id} value={product.id}>
												{product.name} ({product.sku})
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</Grid>
							<Grid size={{ xs: 10, md: 5 }}>
								<TextField
									fullWidth
									type='number'
									label='Quantity'
									value={item.quantity}
									onChange={(e) =>
										handleItemChange(index, 'quantity', Number(e.target.value))
									}
									inputProps={{ min: 1 }}
									required
								/>
							</Grid>
							<Grid size={{ xs: 2, md: 1 }}>
								<IconButton
									color='error'
									onClick={() => handleRemoveItem(index)}
									disabled={items.length === 1}>
									<DeleteIcon />
								</IconButton>
							</Grid>
						</Grid>
					</Box>
				))}

				<Divider sx={{ my: 3 }} />

				{/* Submit Button */}
				<Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
					<Button
						type='submit'
						variant='contained'
						size='large'
						disabled={submitting}>
						{submitting ? 'Saving...' : initialData ? 'Update' : 'Create'}
					</Button>
				</Box>
			</form>
		</Paper>
	);
}
