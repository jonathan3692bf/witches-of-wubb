import { useContext } from 'react';
import { AbletonContext } from '../contexts/ableton-provider';
// import { LoggerContext } from '../contexts/logger-provider';

export default function CurrentlyPlayingList() {
  const { tracks, queuedClips, playingClips } = useContext(AbletonContext);
  // const { logger } = useContext(LoggerContext);

  return (
    <div className='flex flex-row justify-between'>
      {tracks?.map((track, index) => {
        const playing = playingClips[track];
        const queued = queuedClips[track];

        return (
          <div className='w-[15%]' key={index}>
            {track}
            <div className='h-[200px]'>
              <div
                className={`w-full h-full flex items-center text-center rounded-md border border-1 ${
                  queued && 'opacity-40 animate-pulse'
                }`}
              >
                {playing || queued}
              </div>
              {/* {playing || queued ? (
                <img
                  src={`/images/${track}.jpeg`}
                  alt="Track icon"
                  className={`w-full h-full object-cover rounded-md ${queued && 'opacity-40 animate-pulse'}`}
                />
              ) : (
                <div className="w-full h-full object-cover rounded-md border border-1"></div>
              )} */}
            </div>
          </div>
        );
      })}
    </div>
  );
}
