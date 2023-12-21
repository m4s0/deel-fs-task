import {useState} from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {useLoaderData} from "react-router-dom";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import {Profile} from "../types.ts";
import InputLabel from "@mui/material/InputLabel";
import {CustomTable} from "./CustomTable.tsx";

export const PayForJobPage = () => {
    const contractorProfiles = useLoaderData()
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [isTableDisabled, setIsTableDisabled] = useState(true);
    const [selectedContractorId, setSelectedContractorId] = useState<string | null>(null);

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
                <InputLabel htmlFor="contract-profiles">
                    Pay Jobs for...
                </InputLabel>
                <Autocomplete
                    sx={{width: 300, mt: 1, mb: 1}}
                    disablePortal
                    id="contract-profiles"
                    options={contractorProfiles}
                    getOptionLabel={(profile: Profile) => profile.firstName + " " + profile.lastName}
                    renderInput={(params) => <TextField {...params} />}
                    onChange={(e, value) => {
                        if (!value) {
                            setIsButtonDisabled(true)
                            setIsTableDisabled(true)
                            return
                        }
                        setSelectedContractorId(value.id);
                        setIsButtonDisabled(false)
                    }}
                />
                {isTableDisabled
                    ? <Button
                        disabled={isButtonDisabled}
                        onClick={() => setIsTableDisabled(false)}
                        fullWidth
                        variant="contained"
                        sx={{mt: 1, mb: 1}}
                    >
                        Continue
                    </Button>
                    : <></>}
                {isTableDisabled ? <></> : <CustomTable profileId={selectedContractorId}/>}
            </Box>
        </Box>
    )
};
