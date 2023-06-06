import CurrentlyPlayingList from './components/currently-playing-list';
import DebugModal from './components/debug';
import TempoSlider from './components/tempo-slider';
import RecipeBox from './components/recipe-box';
import { useState } from 'react';

// const Circle: React.FC = () => (
//   <div className='w-full h-full rounded-full mix-blend-screen bg-gradient-to-c from-blue-400 to-blue-400 animate-fadein duration-200'></div>
// );

// const CircleContainer: React.FC = () => (
//   <div className='absolute transform -translate-y-10 animate-scale duration-2000 ease-linear'>
//     <Circle />
//   </div>
// );

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div id='container_playing' className='h-[80vh]'>
      <CurrentlyPlayingList setIsModalOpen={setIsModalOpen} />
      <div id='container_tempo' className='absolute top-[800px] left-[200px] h-[16vh]'>
        <TempoSlider />
      </div>
      <div id='container_recipe_box' className='h-[20vh] mt-0'>
        <RecipeBox />
      </div>
      <DebugModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </div>
  );
}
