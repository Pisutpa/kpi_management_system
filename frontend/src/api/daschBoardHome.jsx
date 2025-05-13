import axios from 'axios'

 export const listOverView = async (token) => {
    return await axios.get('http://localhost:5000/api/overview', {
      headers: {
        Authorization: `Bearer ${token}`,
  
      }
    })
  
  }