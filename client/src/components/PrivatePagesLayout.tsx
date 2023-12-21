import {useNavigate, useOutlet} from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from '@mui/icons-material/Menu';
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import {useEffect, useState} from "react";
import Container from "@mui/material/Container";
import {useAuth} from "../auth/useAuth.tsx";

export const PrivatePagesLayout = () => {
    const outlet = useOutlet();
    const navigate = useNavigate();
    const auth = useAuth();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const isMenuOpen = Boolean(anchorEl);

    useEffect(() => {
        if (!auth?.user) {
            navigate("/login", {replace: true});
        }
    }, [auth]);

    const handleClickMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        auth.signOut()
        navigate("/login", {replace: true});
    };

    return (
        <Container component="main" maxWidth={false} disableGutters>
            <Box sx={{flexGrow: 1}}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            sx={{mr: 2}}
                        >
                            <MenuIcon aria-controls={isMenuOpen ? 'basic-menu' : undefined}
                                      aria-haspopup="true"
                                      aria-expanded={isMenuOpen ? 'true' : undefined}
                                      onClick={handleClickMenu}
                            />
                            <Menu
                                id="basic-menu"
                                anchorEl={anchorEl}
                                open={isMenuOpen}
                                onClose={handleCloseMenu}
                                MenuListProps={{
                                    'aria-labelledby': 'basic-button',
                                }}
                            >
                                <MenuItem onClick={() => navigate('/deposit')}>Deposit</MenuItem>
                                <MenuItem onClick={() => navigate('/pay-for-job')}>Pay for Job</MenuItem>
                            </Menu>
                        </IconButton>
                        <Typography variant="h7" component="div" sx={{flexGrow: 1}}>
                            {auth.user?.firstName} {auth.user?.lastName} | Balance: {auth.user?.balance}
                        </Typography>
                        <Button onClick={handleLogout} variant="contained" color="secondary">
                            Logout
                        </Button>
                    </Toolbar>
                </AppBar>
                {outlet}
            </Box>
        </Container>
    );
};
