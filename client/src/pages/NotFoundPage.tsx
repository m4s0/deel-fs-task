import {useNavigate} from "react-router-dom";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

export const NotFoundPage = () => {
    const navigate = useNavigate();

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
                        Page not found.
                    </Typography>
                    <Button onClick={() => navigate(-1)} variant="contained" sx={{mt: 1, mb: 1}}>
                        Go back
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default NotFoundPage;
