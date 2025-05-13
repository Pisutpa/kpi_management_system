import axios from 'axios'
  export const updateKpiApi = async (token, id, cleanForm) => {
    return await axios.put('http://localhost:5000/my-users/:userId/kpis/:kpiId' + id, cleanForm, {
      headers: {
        Authorization: `Bearer ${token}`,
  
      }
    })
  
  }

  
export const readUserApi = async (token, id) => {
  return await axios.get('http://localhost:5000/api/my-users/' + id, {
    headers: {
      Authorization: `Bearer ${token}`,

    }
  })

}


export const getUserKpisApi = async (token, id) => {
  return await axios.get('http://localhost:5000/api/my-users/' + id, {
    headers: {
      Authorization: `Bearer ${token}`,

    }
  })

}




