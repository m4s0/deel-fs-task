import {RouterProvider} from "react-router-dom";
import {router} from "./router.tsx";
import {AuthProvider} from "./auth/AuthProvider.tsx";

export default function App() {
    return (
        <AuthProvider>
            <RouterProvider router={router}/>
        </AuthProvider>
    );
}
