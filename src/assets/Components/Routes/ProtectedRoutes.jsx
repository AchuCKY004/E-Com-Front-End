import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";

function ProtectedRoutes({children}){
   const{ isLoggedIn } = useContext(AuthContext);
    

    if ( !isLoggedIn ){
        return <Navigate to ="/login"/>
    }

    return children ;
}

export default ProtectedRoutes;