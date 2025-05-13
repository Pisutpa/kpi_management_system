import axios from 'axios'


export const createUserApi = async (token, form) => {
  return await axios.post('http://localhost:5000/api/user', form, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })

}
export const listUserApi = async (token) => {
  return await axios.get('http://localhost:5000/api/users', {
    headers: {
      Authorization: `Bearer ${token}`,

    }
  })

}
export const readUserApi = async (token, id) => {
  return await axios.get('http://localhost:5000/api/user/' + id, {
    headers: {
      Authorization: `Bearer ${token}`,

    }
  })

}
export const updateUserApi = async (token, id, form) => {
  return await axios.put('http://localhost:5000/api/user/' + id, form, {
    headers: {
      Authorization: `Bearer ${token}`,

    }
  })

}
export const removeUserApi = async (token, id) => {
  return await axios.delete('http://localhost:5000/api/user/' + id, {
    headers: {
      Authorization: `Bearer ${token}`,

    }
  })

}
