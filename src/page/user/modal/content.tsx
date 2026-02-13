import React from "react"
import { Box, TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText } from "@mui/material"
import { Controller, useFormContext } from "react-hook-form"
import { type UserFormData } from "./schema"

export const UserModalContent: React.FC = () => {
    const { control, formState: { errors } } = useFormContext<UserFormData>()

    return (
        <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2}>
            <Controller
                name="name"
                control={control}
                render={({ field }) => (
                    <TextField
                        {...field}
                        fullWidth
                        label="Full Name"
                        variant="outlined"
                        error={!!errors.name}
                        helperText={errors.name?.message}
                    />
                )}
            />
            <Controller
                name="email"
                control={control}
                render={({ field }) => (
                    <TextField
                        {...field}
                        fullWidth
                        label="Email"
                        type="email"
                        variant="outlined"
                        error={!!errors.email}
                        helperText={errors.email?.message}
                    />
                )}
            />
            <FormControl fullWidth error={!!errors.role}>
                <InputLabel>Role</InputLabel>
                <Controller
                    name="role"
                    control={control}
                    render={({ field }) => (
                        <Select {...field} label="Role">
                            <MenuItem value="User">User</MenuItem>
                            <MenuItem value="Admin">Admin</MenuItem>
                            <MenuItem value="Manager">Manager</MenuItem>
                        </Select>
                    )}
                />
                {errors.role && <FormHelperText>{errors.role.message}</FormHelperText>}
            </FormControl>
            <FormControl fullWidth error={!!errors.status}>
                <InputLabel>Status</InputLabel>
                <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                        <Select {...field} label="Status">
                            <MenuItem value="Active">Active</MenuItem>
                            <MenuItem value="Inactive">Inactive</MenuItem>
                            <MenuItem value="Pending">Pending</MenuItem>
                        </Select>
                    )}
                />
                {errors.status && <FormHelperText>{errors.status.message}</FormHelperText>}
            </FormControl>
            <Box gridColumn="span 2">
                <Controller
                    name="bio"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            fullWidth
                            label="Bio"
                            multiline
                            rows={3}
                            variant="outlined"
                            error={!!errors.bio}
                            helperText={errors.bio?.message}
                        />
                    )}
                />
            </Box>
        </Box>
    )
}