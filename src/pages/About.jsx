import AboutHero from "../components/about/AboutHero";
import AboutFoundation from "../components/about/AboutFoundation";
import FounderMessage from "../components/about/FounderMessage";
import OurStory from "../components/about/OurStory";
import VisionMission from "../components/about/VisionMission"; 
import CoreValues from "../components/about/CoreValues";


function About() {
  return (
    <div className="bg-slate-50">

      <AboutHero />
<FounderMessage />
 <VisionMission />
      <AboutFoundation />
      
     
      <CoreValues />
      <OurStory />
    </div>
  );
}

export default About;