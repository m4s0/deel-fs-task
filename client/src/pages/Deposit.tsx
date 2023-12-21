import Box from "@mui/material/Box";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import {useState} from "react";
import {deposit} from "../services/http/deposit.ts";
import InputLabel from "@mui/material/InputLabel";
import Alert from "@mui/material/Alert";
import {useAuth} from "../auth/useAuth.tsx";

const amounts = [
    {
        label: '1',
        value: 1,
    },
    {
        label: '5',
        value: 5,
    },
    {
        label: '10',
        value: 10,
    },
    {
        label: '50',
        value: 50,
    },
    {
        label: '100',
        value: 100,
    },
    {
        label: '500',
        value: 500,
    },
];

export const DepositPage = () => {
    const auth = useAuth();
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleClick = async () => {
        setIsButtonDisabled(true)
        setErrorMessage(null)

        try {
            await deposit(selectedAmount, auth?.user?.id)
            auth.refreshUser()
        } catch (e) {
            setErrorMessage(e.message)
        }
        setIsButtonDisabled(false)
    };

    return (
        <Box
            sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <Box component="form" noValidate sx={{mt: 3}}>
                <InputLabel htmlFor="amounts">
                    Select the amount to Deposit
                </InputLabel>
                <Select
                    sx={{mt: 1, mb: 1}}
                    fullWidth
                    name="amounts"
                    onChange={(value) => {
                        setSelectedAmount(value.target.value);
                        setIsButtonDisabled(false)
                    }}
                >
                    {amounts.map((amount, i) => (
                        <MenuItem
                            key={i}
                            value={amount.value}
                        >
                            {amount.label}
                        </MenuItem>
                    ))}
                </Select>
                <Button
                    disabled={isButtonDisabled}
                    onClick={handleClick}
                    fullWidth
                    variant="contained"
                    sx={{mt: 1, mb: 1}}
                >
                    deposit
                </Button>
                {errorMessage
                    ? <Alert severity="error">{errorMessage}</Alert>
                    : <></> }
            </Box>
        </Box>
    )
};
