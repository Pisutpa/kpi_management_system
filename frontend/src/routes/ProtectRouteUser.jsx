import React, { useState, useEffect } from "react";
import useKpiStore from "../store/kpi-store";
import { currentUser } from "../api/authApi";
import { Navigate } from "react-router-dom";
import LoadingToRedirect from "./LoadingToRedirect";

const ProtectRouteUser = ({ element }) => {
  const [ok, setOK] = useState(false);
  const user = useKpiStore((state) => state.user);
  const token = useKpiStore((state) => state.token);

  useEffect(() => {
    if (user && token) {
      currentUser(token)
        .then((res) => {
          console.log(res);
          setOK(true)
        })
        .catch((err) => {
          console.log(err);
          setOK(false)
        });
    } 
  }, [])

  

 
  return ok ? element :<LoadingToRedirect />
};

export default ProtectRouteUser;
