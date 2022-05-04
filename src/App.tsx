import './App.scss';
import DescriptionSection from './components/DescriptionSection/DescriptionSection';
import ExpandableGraphSection from './components/ExpandableGraphSection/ExpandableGraphSection';
import Footer from './components/Footer/Footer';
import ForceGraphSection from './components/ForceGraphSection/ForceGraphSection';
import StaticGraphSection from './components/StaticGraphSection/StaticGraphSection';
import TitleSection from './components/TitleSection/TitleSection';
import TopicGradeSection from './components/TopicGradeSection/TopicGradeSection';
import WordcloudSection from './components/WordcloudSection/WordcloudSection';

function App() {
  return (
    <div className="App">
      <TitleSection />
      <div className='outer-wrapper'>
        <DescriptionSection />
      </div>
      <div className='outer-wrapper'>
        <WordcloudSection />
      </div>
      <div className='outer-wrapper'>
        <TopicGradeSection />
      </div>
      <div className='outer-wrapper'>
        <StaticGraphSection />
      </div>
      <div className='outer-wrapper'>
        <ForceGraphSection />
      </div>
      {/* <div className='outer-wrapper'>
        <ExpandableGraphSection />
      </div> */}
      <Footer />
    </div>
  );
}

export default App;
