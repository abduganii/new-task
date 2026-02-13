import React, { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useAppStore } from '../../../store/useAppStore';
import { GlobalModal } from '../../../components/GlobalModal';
import { userSchema, type UserFormData } from './schema';
import { UserModalContent } from './content';
import { Button, CircularProgress } from '@mui/material';


export const UserModal: React.FC = () => {
    const { selectedUser, isModalOpen, setIsModalOpen, updateUser, isSaving } = useAppStore();
    const methods = useForm<UserFormData>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            name: '',
            email: '',
            role: 'User',
            status: 'Active',
            bio: '',
        },
    });

    const { handleSubmit, reset } = methods;

    useEffect(() => {
        if (selectedUser) {
            reset({
                name: selectedUser.name,
                email: selectedUser.email,
                role: selectedUser.role,
                status: selectedUser.status,
                bio: selectedUser.bio || '',
            });
        }
    }, [selectedUser, reset]);

    const onSubmit = (data: UserFormData) => {
        if (selectedUser) {
            updateUser({ ...selectedUser, ...data });
        }
    };

    const handleClose = () => {
        setIsModalOpen(false);
    };

    if (!selectedUser) return null;

    return (
        <GlobalModal
            open={isModalOpen}
            onClose={handleClose}
            title="Edit User"
            isLoading={isSaving}
            actions={
                <>
                    <Button onClick={handleClose} color="inherit" disabled={isSaving}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit(onSubmit)}
                        variant="contained"
                        disabled={isSaving}
                        startIcon={isSaving && <CircularProgress size={20} color="inherit" />}
                    >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                </>
            }
        >
            <form onSubmit={handleSubmit(onSubmit)} id="user-form">
                <FormProvider {...methods}>
                    <UserModalContent />
                </FormProvider>
            </form>
        </GlobalModal>
    );
};
