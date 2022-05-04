import './App.scss';
import DescriptionSection from './components/DescriptionSection/DescriptionSection';
import ExpandableGraphSection from './components/ExpandableGraphSection/ExpandableGraphSection';
import Footer from './components/Footer/Footer';
import ForceGraphSection from './components/ForceGraphSection/ForceGraphSection';
import TitleSection from './components/TitleSection/TitleSection';
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
        <ForceGraphSection />
      </div>
      <div className='outer-wrapper'>
        <ExpandableGraphSection />
      </div>
      <Footer />
    </div>
  );
}

export default App;
