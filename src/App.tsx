import CurrentlyPlayingList from './components/currently-playing-list';
import DebugModal from './components/debug';

export default function App() {
  return (
    <div>
      <CurrentlyPlayingList />

      <DebugModal />
    </div>
  );
}
