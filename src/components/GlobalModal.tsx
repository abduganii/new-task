import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

interface GlobalModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    actions?: React.ReactNode;
    isLoading?: boolean;
    maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export const GlobalModal: React.FC<GlobalModalProps> = ({
    open,
    onClose,
    title,
    children,
    actions,
    isLoading = false,
    maxWidth = 'sm'
}) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth={maxWidth}
            fullWidth
            PaperProps={{
                elevation: 24,
                sx: { borderRadius: 3 }
            }}
        >
            <DialogTitle display="flex" justifyContent="space-between" alignItems="center">
                {title}
                <IconButton onClick={onClose} size="small" disabled={isLoading}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers>
                {children}
            </DialogContent>

            {actions && (
                <DialogActions sx={{ p: 2.5 }}>
                    {actions}
                </DialogActions>
            )}
        </Dialog>
    );
};
