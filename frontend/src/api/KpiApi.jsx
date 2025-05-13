import axios from 'axios'

export const createKpiApi = async (token, cleanForm) => {
  return await axios.post('http://localhost:5000/api/kpi', cleanForm, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })

}

export const listKpiApi = async (token) => {
  return await axios.get('http://localhost:5000/api/kpis', {
    headers: {
      Authorization: `Bearer ${token}`,

    }
  })

}
export const removeKpiApi = async (token, id) => {
  return await axios.delete('http://localhost:5000/api/kpi/' + id, {
    headers: {
      Authorization: `Bearer ${token}`,

    }
  })

}

export const readKpiApi = async (token, id) => {
  return await axios.get('http://localhost:5000/api/kpi/' + id, {
    headers: {
      Authorization: `Bearer ${token}`,

    }
  })

}

export const updateKpiApi = async (token, id, cleanForm) => {
  return await axios.put('http://localhost:5000/api/kpi/' + id, cleanForm, {
    headers: {
      Authorization: `Bearer ${token}`,

    }
  })

}
export const updateKpiUserApi = async (token, id, form) => {
  return await axios.put('http://localhost:5000/api/my-users/kpis/' + id, form, {
    headers: {
      Authorization: `Bearer ${token}`,

    }
  })

}

export const KpiPDF = async (token) => {
  return await axios.get('http://localhost:5000/api/kpis/export/pdf', {
    headers: {
      Authorization: `Bearer ${token}`,

    }
  })

}
export const KpiCSV = async (token) => {
  return await axios.get('http://localhost:5000/api/kpis/export/csv', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    responseType: 'text',
  });
};

