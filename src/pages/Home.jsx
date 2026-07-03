import Hero from "../components/Hero";
import ImpactStats from "../components/ImpactStats";
import ScholarshipPrograms from "../components/ScholarshipPrograms";
import EducationInspires from "../components/EducationInspires";
import CallToAction from "../components/CallToAction";
import PageTitle from "../components/PageTitle";

function Home() {
  return (
    <>
       <PageTitle title="Home" />
      <Hero />

      <ImpactStats />

      <ScholarshipPrograms />

      <EducationInspires />

      <CallToAction />
    </>
  );
}

export default Home;