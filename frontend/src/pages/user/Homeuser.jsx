import React from 'react'
import UpdeteKpi from '../../components/user/UpdeteKpi'
import { useParams } from 'react-router-dom';

const Homeuser = () => {
  const { id } = useParams();
  return (
    <div>
      <UpdeteKpi />
      {id}
    </div>
  )
}
export default Homeuser