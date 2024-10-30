import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { CoffeeCardProps } from '../../types/types';

interface EditQuantityDialogProps {
    open: boolean;
    item: CoffeeCardProps | null;
    quantity: number;
    onClose: () => void;
    onQuantityChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onSave: () => void;
}

const EditQuantityDialog = ({
    open,
    quantity,
    onClose,
    onQuantityChange,
    onSave
}: EditQuantityDialogProps): JSX.Element => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            PaperProps={{
                style: {
                    backgroundColor: '#5F6F52',
                    color: 'white',
                },
            }}
        >
            <DialogTitle>Edit Quantity</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Qty"
                    type="text"
                    fullWidth
                    value={quantity}
                    onChange={onQuantityChange}
                    InputProps={{
                        style: { color: 'white' }
                    }}
                    InputLabelProps={{
                        style: { color: 'white' }
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: 'white',
                            },
                            '&:hover fieldset': {
                                borderColor: 'white',
                            },
                        },
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} sx={{ color: 'white' }}>
                    Cancel
                </Button>
                <Button onClick={onSave} sx={{ color: 'white' }}>
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditQuantityDialog;