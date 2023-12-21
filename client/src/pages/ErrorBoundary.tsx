import {useRouteError} from "react-router-dom";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export const ErrorBoundary = () => {
    const error = useRouteError();
    console.error(error);

    return (
        <Container component="main" maxWidth={false} disableGutters>
            <Box sx={{flexGrow: 1}}>
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography variant="h7" component="div" sx={{flexGrow: 1}}>
                        {error}
                    </Typography>
                </Box>
            </Box>
        </Container>
    );
};
