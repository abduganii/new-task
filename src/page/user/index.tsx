import { UserModal } from "./modal"
import { Box, Container } from "@mui/material"
import { UserTable } from "./table"
import { UserControls } from "./UserControls"

export const UserPage: React.FC = () => {
    return (
        <>
            <Container maxWidth="xl" sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, py: 3, height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
                <UserControls />
                <Box flex={1} overflow="hidden">
                    <UserTable />
                </Box>
            </Container>
            <UserModal />
        </>

    )
}