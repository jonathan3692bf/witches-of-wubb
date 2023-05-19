import { Fragment, useState, useContext, useEffect } from 'react';

import { AbletonContext } from '~/contexts/ableton-provider';
// import useCountdown from '~/hooks/use-countdown';
import { SocketioContext } from '~/contexts/socketio-provider';
import { LoggerContext } from '~/contexts/logger-provider';

import { Dialog, Transition, Switch } from '@headlessui/react';
import classNames from 'classnames';

import csv from '~/assets/Music Database.csv';
const RFIDToClipMap: Record<string, any> = {};
const ClipNameToInfoMap: Record<string, any> = {};
csv.forEach((row: any) => {
  const rfid = row['Asset ID'];
  const clipName = row['Clip Name'];
  const type = row['Clip Type (e.g. Vocals)'];
  const assetName = row['Icon / Asset Name'];
  if (clipName?.trim()) {
    RFIDToClipMap[rfid] = { clipName, type, assetName };
    ClipNameToInfoMap[clipName] = { rfid, type, assetName };
  }
});

export default function DebugModal() {
  const socket = useContext(SocketioContext);
  const { enableDebug, disableDebug } = useContext(LoggerContext);
  // const { countdown } = useCountdown();
  const { isLoading, playingClips, queuedClips, stoppingClips } = useContext(AbletonContext);
  const [isOpen, setIsOpen] = useState(false);
  const socketStatus = socket?.connected ? 'connected' : 'not connected';

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  function toggleSong(rfid: string, pillar: number, start: boolean) {
    if (start) {
      socket.emit('/new/tag', { rfid, pillar });
    } else {
      socket.emit('/departed/tag', { rfid, pillar });
    }
  }

  useEffect(() => {
    if (isOpen) {
      enableDebug();
      return disableDebug;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <>
      <div className='absolute bottom-0 left-0 flex items-center justify-center'>
        <button
          type='button'
          onClick={openModal}
          className='rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75'
        >
          Open debug
        </button>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as='div' className='relative z-10' onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-black bg-opacity-25' />
          </Transition.Child>

          <div className='fixed inset-0 '>
            <div className='flex w-full h-full max-h-screen items-center justify-center'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 scale-95'
                enterTo='opacity-100 scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 scale-100'
                leaveTo='opacity-0 scale-95'
              >
                <Dialog.Panel className='w-screen max-w-xxl transform rounded-md bg-white text-black text-left align-middle shadow-xl transition-all'>
                  <div className='flex flex-row gap-8 my-4 px-6'>
                    <p className='text-xl'>Socket: {socketStatus}</p>
                    <p className='text-xl'>Ableton: {isLoading ? 'loading' : 'loaded'}</p>
                    {/* <p className='text-xl'>Reset timer: {countdown}s</p> */}
                  </div>
                  <div className='grid grid-flow-col gap-8 auto-cols-max px-6 w-full max-w-screen max-h-[calc(100vh-8rem)] overflow-scroll'>
                    {[1, 2, 3, 4].map((pillar, index) => {
                      return (
                        <div key={pillar} className='grid grid-flow-row auto-rows-max'>
                          <div>Pillar {pillar}</div>
                          <div className='grid'>
                            {Object.entries(ClipNameToInfoMap).map(([clipName, { rfid }]) => {
                              const formattedName = clipName?.replace(/[* ]/g, '');
                              const stopping =
                                stoppingClips[index]?.clipName?.replace(/[* ]/g, '') ===
                                formattedName;
                              const queued =
                                queuedClips[index]?.clipName?.replace(/[* ]/g, '') ===
                                formattedName;
                              const playing =
                                playingClips[index]?.clipName?.replace(/[* ]/g, '') ===
                                formattedName;

                              const classes = classNames({
                                'text-red-600 animate-pulse': stopping,
                                'text-green-600': playing && !stopping,
                                'text-green-500 animate-pulse': queued,
                                // 'text-sm': !loopLeader,
                                'flex gap-3 mt-2': true,
                              });
                              return (
                                <div key={clipName} className={classes}>
                                  <Switch
                                    checked={playing || queued}
                                    onChange={(newState) => toggleSong(rfid, index, newState)}
                                    className='relative inline-flex h-6 w-11 items-center rounded-full ui-checked:bg-green-600 ui-not-checked:bg-gray-200'
                                  >
                                    <span className='sr-only'>Play clip</span>
                                    <span
                                      className={`${
                                        playing || queued ? 'translate-x-6' : 'translate-x-1'
                                      } 
                                        inline-block h-4 w-4 transform rounded-full bg-white transition`}
                                    />
                                  </Switch>

                                  <div>{clipName}</div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className='p-6'>
                    <button
                      type='button'
                      className='inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
                      onClick={closeModal}
                    >
                      Exit
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
