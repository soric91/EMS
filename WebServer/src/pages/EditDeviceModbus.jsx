import { useParams } from 'react-router-dom';

function EditDeviceModbus() {
  const { id } = useParams();

  return (
    <div>EditDeviceModbus {id}</div>
  )
}

export default EditDeviceModbus