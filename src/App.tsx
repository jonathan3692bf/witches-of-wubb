import CurrentlyPlayingList from './components/currently-playing-list';
import DebugModal from './components/debug';
import TempoSlider from './components/tempo-slider';
import RecipeBox from './components/recipe-box';

// const Circle: React.FC = () => (
//   <div className='w-full h-full rounded-full mix-blend-screen bg-gradient-to-c from-blue-400 to-blue-400 animate-fadein duration-200'></div>
// );

// const CircleContainer: React.FC = () => (
//   <div className='absolute transform -translate-y-10 animate-scale duration-2000 ease-linear'>
//     <Circle />
//   </div>
// );

export default function App() {
  return (
    <div id='container_playing' className='h-[50vh]'>
      <CurrentlyPlayingList />
      <div id='container_tempo' className='h-[16vh] mt-0'>
        <TempoSlider />
      </div>
      <div id='container_recipe_box' className='h-[25vh] mt-0'>
        <RecipeBox />
      </div>
      <DebugModal />
    </div>
  );
}
