import {ChangeEvent, useEffect, useState} from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import {getJobsBelongsToContractor} from "../services/http/getJobsBelongsToContractor.ts";
import {Button} from "@mui/material";
import {Job} from "../types.ts";
import {payForJob} from "../services/http/payForJob.ts";
import Alert from "@mui/material/Alert";
import {useAuth} from "../auth/useAuth.tsx";

interface Column {
    id: 'id' | 'description' | 'paid' | 'price' | 'paymentDate' | 'contractId' | 'createdAt' | 'updatedAt';
    label: string | undefined;
    format?: (value: number | boolean | string, item?: Job) => string | JSX.Element;
}

const columns: readonly Column[] = [
    {
        id: "id",
        label: "id",
    },
    {
        id: "description",
        label: "description",
    },
    {
        id: "paid",
        label: "paid",
        format: (value: number | boolean | string) => {
            return value ? "Yes" : "No";
        },
    },
    {
        id: "price",
        label: "price",
        format: (value: number | boolean | string) => {
            return value + " €";
        },
    },
    {
        id: "paymentDate",
        label: "paymentDate",
    },
    {
        id: "contractId",
        label: "contractId",
    },
    {
        id: "createdAt",
        label: "createdAt",
    },
    {
        id: "updatedAt",
        label: "updatedAt",
    },
];

interface CustomTableProps {
    profileId: string | null
}

export const CustomTable = ({profileId}: CustomTableProps) => {
    const auth = useAuth();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [rows, setRows] = useState<Job[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            const results = await getJobsBelongsToContractor(profileId);
            setRows(results);
            auth.refreshUser()
        } catch (e) {
            setErrorMessage(e.message)
        }
    };

    const refreshUI = async () => {
        setErrorMessage(null)
        await fetchData();
    };

    useEffect(() => {
        refreshUI();
    }, [profileId]);

    const handleChangePage = (event: MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleClickPayForJob = async (jobId: string) => {
        setErrorMessage(null)

        try {
            await payForJob(jobId, auth?.user?.id)
            refreshUI();
        } catch (e) {
            setErrorMessage(e.message)
        }
    };

    return (
        <Paper sx={{width: '100%', overflow: 'hidden', mt: 3, mb: 2}}>
            {errorMessage
                ? <Alert severity="error">{errorMessage}</Alert>
                : <></> }
            <TableContainer sx={{maxHeight: 440}}>
                <Table stickyHeader aria-label="sticky table" size="small">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((item: Job, index: number) => {
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={item.id}>
                                        {columns.map((column: Column) => {
                                            const value = item[column.id]
                                            return (
                                                <TableCell key={"table-row-cell-" + index + column.id}
                                                           component="th"
                                                           id={column.id}
                                                           scope="row"
                                                >
                                                    {column.format ? column.format(value, item) : value}
                                                </TableCell>
                                            )
                                        })}
                                        <TableCell key="table-row-cell-payForJobButton"
                                                   component="th"
                                                   id="payForJobButton"
                                                   scope="row"
                                        >
                                            {item?.paid
                                                ? <></>
                                                :
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    onClick={() => {
                                                        handleClickPayForJob(item?.id)
                                                    }}
                                                >
                                                    Pay
                                                </Button>
                                            }
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
};
