'use client';

import { useParams, useRouter } from 'next/navigation';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from 'next/link';
import { usePurchaseRequest } from '../../../../hooks/usePurchaseRequest';
import PurchaseRequestForm from '../../../../components/purchase-requests/PurchaseRequestForm';
import LoadingSpinner from '../../../../components/common/LoadingSpinner';
import ErrorAlert from '../../../../components/common/ErrorAlert';
import { purchaseRequestService } from '../../../../services/purchaseRequestService';

interface FormData {
  warehouse_id: number;
  vendor?: string;
  items: {
    product_id: number;
    quantity: number;
  }[];
}

export default function EditPurchaseRequestPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const { purchaseRequest, loading, error } = usePurchaseRequest(id);

  const handleSubmit = async (data: FormData) => {
    try {
      await purchaseRequestService.update(id, data);
      router.push(`/purchase-requests/${id}`);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to update purchase request');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorAlert error={error} />;
  if (!purchaseRequest) return <ErrorAlert error="Purchase request not found" />;

  if (purchaseRequest.status !== 'DRAFT') {
    return (
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <ErrorAlert error="Can only edit purchase requests with DRAFT status" />
          <Button
            startIcon={<ArrowBackIcon />}
            component={Link}
            href={`/purchase-requests/${id}`}
            sx={{ mt: 2 }}
          >
            Back to Details
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            component={Link}
            href={`/purchase-requests/${id}`}
          >
            Back
          </Button>
          <Typography variant="h4" component="h1">
            Edit Purchase Request
          </Typography>
        </Box>

        <PurchaseRequestForm 
          onSubmit={handleSubmit}
          initialData={purchaseRequest}
        />
      </Box>
    </Container>
  );
}