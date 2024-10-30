import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

import { ConfirmationDialogProps } from '../../types/types';

const StyledDialog = styled(Dialog)({
    '& .MuiPaper-root': {
        backgroundColor: '#5F6F52',
        color: 'white',
    }
});

const StyledButton = styled(Button)({
    color: 'white',
    '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    }
});

const ConfirmationDialog = ({ 
    open, 
    title, 
    message, 
    onClose, 
    onConfirm 
}: ConfirmationDialogProps): JSX.Element => {
    return (
        <StyledDialog
            open={open}
            onClose={onClose}
            aria-labelledby="confirmation-dialog-title"
            aria-describedby="confirmation-dialog-description"
        >
            <DialogTitle id="confirmation-dialog-title">
                {title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="confirmation-dialog-description" sx={{ color: 'white' }}>
                    {message}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <StyledButton onClick={onClose}>No</StyledButton>
                <StyledButton 
                    onClick={onConfirm} 
                    autoFocus
                    sx={{ 
                        '&:hover': { 
                            backgroundColor: 'rgba(239, 68, 68, 0.2)' 
                        } 
                    }}
                >
                    Yes
                </StyledButton>
            </DialogActions>
        </StyledDialog>
    );
};

export default ConfirmationDialog;