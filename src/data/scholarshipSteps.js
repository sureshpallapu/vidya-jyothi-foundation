import PersonalDetails from "../components/scholarship/PersonalDetails";
import AddressDetails from "../components/scholarship/AddressDetails";
import EducationDetails from "../components/scholarship/EducationDetails";
import BankDetails from "../components/scholarship/BankDetails";
import DocumentUpload from "../components/scholarship/DocumentUpload";
import Declaration from "../components/scholarship/Declaration";
import ApplicationPreview from "../pages/scholarship/ApplicationPreview";

const scholarshipSteps = [
  {
    id: 1,
    title: "Personal Details",
    component: PersonalDetails,
  },
  {
    id: 2,
    title: "Address Details",
    component: AddressDetails,
  },
  {
    id: 3,
    title: "Education Details",
    component: EducationDetails,
  },
  {
    id: 4,
    title: "Bank Details",
    component: BankDetails,
  },
  {
    id: 5,
    title: "Document Upload",
    component: DocumentUpload,
  },
  {
    id: 6,
    title: "Declaration",
    component: Declaration,
  },
  {
  id: 7,
  title: "Preview",
  component: ApplicationPreview,
},
];

export default scholarshipSteps;