import CurrentlyPlayingList from './components/currently-playing-list';
import DebugModal from './components/debug';
import TempoSlider from './components/tempo-slider';
import RecipeBox from './components/recipe-box';
import { useState, useEffect } from 'react';

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

  useEffect(() => {
    const handleContextMenu = (event: MouseEvent) => {
      event.preventDefault();
    };

    document.addEventListener('contextmenu', handleContextMenu);

    // Cleanup function to remove the event listener when the component is unmounted
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  return (
    <div id='container_playing' className='overflow-hidden max-h-screen'>
      <CurrentlyPlayingList />
      <div id='container_tempo' className='relative -top-[50px]'>
        <TempoSlider />
      </div>
      <button onClick={() => setIsModalOpen(true)} className='absolute start-0 p-4 z-10'>
        &nbsp;&nbsp;&nbsp;
      </button>
      <div id='container_recipe_box' className=''>
        <RecipeBox />
      </div>
      <DebugModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </div>
  );
}
