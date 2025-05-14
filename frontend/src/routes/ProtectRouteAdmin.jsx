import React, { useState, useEffect } from "react"
import useKpiStore from "../store/kpi-store"
import { currentAdmin } from "../api/authApi"
import LoadingToRedirect from "./LoadingToRedirect"

const ProtectRouteAdmin = ({ element }) => {
  const [ok, setOK] = useState(false)
  const user = useKpiStore((state) => state.user)
  const token = useKpiStore((state) => state.token)
  console.log(token)

  useEffect(() => {
    if (user && token) {
      currentAdmin(token)
        .then((res) => {
          console.log('res', res)
          setOK(true)
        })
        .catch((err) => {
          console.log(err)
          setOK(false)
        })
    }
  }, [])

  console.log(ok);
  console.log('elment', element);


  return ok ? element : <LoadingToRedirect />
}

export default ProtectRouteAdmin
