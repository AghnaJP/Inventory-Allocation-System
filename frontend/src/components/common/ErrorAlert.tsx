import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

interface ErrorAlertProps {
	error: string;
	onClose?: () => void;
}

export default function ErrorAlert({ error, onClose }: ErrorAlertProps) {
	return (
		<Alert severity='error' onClose={onClose} sx={{ mb: 2 }}>
			<AlertTitle>Error</AlertTitle>
			{error}
		</Alert>
	);
}
