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
    // Disable scrolling on the body by setting the overflow property to hidden
    document.body.style.overflow = 'hidden';

    // Don't forget to reset this on component unmount
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  useEffect(() => {
    const preventZoom = (e: WheelEvent | KeyboardEvent) => {
      const { ctrlKey, metaKey } = e;
      const zoomCondition = navigator.platform.match('Mac') ? metaKey : ctrlKey;
      if (zoomCondition) {
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', preventZoom);
    window.addEventListener('wheel', preventZoom, { passive: false });

    return () => {
      window.removeEventListener('keydown', preventZoom);
      window.removeEventListener('wheel', preventZoom);
    };
  }, []);

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
    <div id='container_playing' className=''>
      <CurrentlyPlayingList setIsModalOpen={setIsModalOpen} />
      <div id='container_tempo' className='absolute top-[800px] left-[200px] h-[16vh]'>
        <TempoSlider />
      </div>
      <div id='container_recipe_box' className=''>
        <RecipeBox />
      </div>
      <DebugModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </div>
  );
}
