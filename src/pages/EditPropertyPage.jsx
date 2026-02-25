import { useParams } from "react-router-dom";
import PropertyForm from "../components/PropertyForm";

const EditPropertyPage = () => {
  const { id } = useParams();
  return <PropertyForm mode="edit" propertyId={id} />;
};

export default EditPropertyPage;
