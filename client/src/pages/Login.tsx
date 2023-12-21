import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import {useLoaderData, useNavigate} from "react-router-dom";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import {useState} from "react";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import {useAuth} from "../auth/useAuth.tsx";

export const LoginPage = () => {
    const navigate = useNavigate();
    const clientProfiles = useLoaderData()
    const auth = useAuth();
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [selectedClient, setSelectedClient] = useState<string | null>(null);

    const handleClick = async () => {
        auth.signIn(selectedClient)
        navigate("/deposit", {replace: true});
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Box component="form" noValidate sx={{mt: 3}}>
                    <Typography component="h3" variant="h5">
                        Select a Client Profile
                    </Typography>
                    <Select
                        sx={{mt: 3, mb: 2}}
                        fullWidth
                        name="profiles"
                        onChange={(value) => {
                            setSelectedClient(value.target.value);
                            setIsButtonDisabled(false)
                        }}
                    >
                        {clientProfiles.map((profile, i) => (
                            <MenuItem
                                key={i}
                                value={profile.id}
                            >
                                {profile === "" ? "None" : profile.firstName + " " + profile.lastName}
                            </MenuItem>
                        ))}
                    </Select>
                    <Button
                        disabled={isButtonDisabled}
                        onClick={handleClick}
                        fullWidth
                        variant="contained"
                        sx={{mt: 3, mb: 2}}
                    >
                        Login
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};
