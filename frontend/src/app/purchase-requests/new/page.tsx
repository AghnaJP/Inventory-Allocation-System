'use client';

import { useRouter } from 'next/navigation';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from 'next/link';
import PurchaseRequestForm from '../../../components/purchase-requests/PurchaseRequestForm';
import { purchaseRequestService } from '../../../services/purchaseRequestService';
import { CreatePurchaseRequestDTO } from '../../../types/purchaseRequest';

export default function NewPurchaseRequestPage() {
  const router = useRouter();

  const handleSubmit = async (data: CreatePurchaseRequestDTO) => {
    try {
      await purchaseRequestService.create(data);
      router.back();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to create purchase request');
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Button startIcon={<ArrowBackIcon />} component={Link} href="/purchase-requests">
            Back
          </Button>
          <Typography variant="h4" component="h1">
            Create Purchase Request
          </Typography>
        </Box>

        <PurchaseRequestForm onSubmit={handleSubmit} />
      </Box>
    </Container>
  );
}
