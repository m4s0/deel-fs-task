import {createBrowserRouter, createRoutesFromElements, Navigate, Route} from "react-router-dom";
import {ErrorBoundary} from "./pages/ErrorBoundary.tsx";
import {LoginPage} from "./pages/Login.tsx";
import {PrivatePagesLayout} from "./components/PrivatePagesLayout.tsx";
import {DepositPage} from "./pages/Deposit.tsx";
import {PayForJobPage} from "./pages/PayForJob.tsx";
import {NotFoundPage} from "./pages/NotFoundPage.tsx";
import {getClientProfiles} from "./services/http/getClientProfiles.ts";
import {getContractorProfiles} from "./services/http/getContractorProfiles.ts";

export const router = createBrowserRouter(
    createRoutesFromElements(
        <Route errorElement={<ErrorBoundary/>}>
            <Route path="/login" element={<LoginPage/>} loader={() => getClientProfiles()}/>

            <Route path="/" element={<PrivatePagesLayout/>}>
                <Route path="deposit" element={<DepositPage/>}/>
                <Route path="pay-for-job" element={<PayForJobPage/>} loader={() => getContractorProfiles()}/>
            </Route>

            <Route path="/404" element={<NotFoundPage/>}/>
            <Route path="*" element={<Navigate replace to="/404"/>}/>
        </Route>
    )
);
