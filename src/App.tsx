import CurrentlyPlayingList from './components/currently-playing-list';
import DebugModal from './components/debug';
import TempoSlider from './components/tempo-slider';

export default function App() {
  return (
    <div>
      <CurrentlyPlayingList />
      <div className='mt-8'>
        <TempoSlider />
      </div>
      <DebugModal />
    </div>
  );
}
