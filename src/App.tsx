import DebugModal from './components/debug';
import Test from './components/test';

function App() {
  return (
    <div>
      <h1>Hello world</h1>
      <div className="flex gap-8">
        <Test />
        <Test />
      </div>

      <DebugModal />
    </div>
  );
}

export default App;
