import ScholarshipHero from "../components/scholarship/ScholarshipHero";
import ScholarshipOverview from "../components/scholarship/ScholarshipOverview";
import EligibilitySection from "../components/scholarship/EligibilitySection";
import RequiredDocuments from "../components/scholarship/RequiredDocuments";
import ScholarshipCTA from "../components/scholarship/ScholarshipCTA";
import SelectionProcess from "../components/scholarship/SelectionProcess";
import ScholarshipGuidelines from "../components/scholarship/ScholarshipGuidelines";
function Scholarship() {
  return (
    <>
      <ScholarshipHero />
      <ScholarshipOverview />
      <EligibilitySection />
      <RequiredDocuments />
      <SelectionProcess />
      <ScholarshipGuidelines />
      <ScholarshipCTA />
    </>
  );
}

export default Scholarship;