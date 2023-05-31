import CurrentlyPlayingList from './components/currently-playing-list';
import DebugModal from './components/debug';
import TempoSlider from './components/tempo-slider';

const Circle: React.FC = () => (
  <div className='w-full h-full rounded-full mix-blend-screen bg-gradient-to-c from-blue-400 to-blue-400 animate-fadein duration-200'></div>
);

const CircleContainer: React.FC = () => (
  <div className='absolute transform -translate-y-10 animate-scale duration-2000 ease-linear'>
    <Circle />
  </div>
);

export default function App() {
  return (
    <div className='container w-full h-full'>
      {Array.from({ length: 100 }, (_, i) => (
        <CircleContainer key={i} />
      ))}
      <CurrentlyPlayingList />
      <div className='mt-0'>
        <TempoSlider />
      </div>
      <DebugModal />
    </div>
  );
}
