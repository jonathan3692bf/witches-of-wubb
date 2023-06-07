import { Fragment, useContext, useEffect } from 'react';

import { AbletonContext } from '~/contexts/ableton-provider';
import { SocketioContext } from '~/contexts/socketio-provider';
import { LoggerContext } from '~/contexts/logger-provider';
import { RFIDToClipMap, ClipNameToInfoMap } from '~/lib/database-output';
import { Dialog, Transition, Switch } from '@headlessui/react';
import classNames from 'classnames';

function ClipButton({
  clipName,
  stopping,
  playing,
  queued,
  onClick,
}: {
  clipName: string;
  stopping?: boolean;
  playing?: boolean;
  queued?: boolean;
  onClick: () => void;
}) {
  const classes = classNames({
    'text-red-600 animate-pulse': stopping,
    'text-green-600': playing && !stopping,
    'text-green-500 animate-pulse': queued,
    // 'text-sm': !loopLeader,
    'gap-4': true,
  });
  return (
    <div key={clipName} className={classes}>
      <button onClick={onClick} className='grid grid-flow-col items-start gap-2'>
        <Switch
          as='div'
          checked={(playing || queued) ?? false}
          className={`relative inline-flex h-6 w-11 items-center rounded-full ${
            playing || queued
              ? 'ui-checked:bg-green-600'
              : stopping
              ? 'ui-not-checked:bg-red-600'
              : ''
          } ui-not-checked:bg-gray-200`}
        >
          <span className='sr-only'>Play clip</span>
          <span
            className={`${playing || queued ? 'translate-x-6' : 'translate-x-1'} 
          inline-block h-4 w-4 transform rounded-full bg-white transition`}
          />
        </Switch>

        <div>{clipName}</div>
      </button>
    </div>
  );
}

const clips = Object.entries(RFIDToClipMap)
  .map(([rfid, data]) => ({ ...data, rfid }))
  .sort((a, b) => {
    if (a && b) return a?.clipName?.localeCompare(b?.clipName);
    return 0;
  });

export default function DebugModal({
  isModalOpen,
  setIsModalOpen,
}: {
  isModalOpen: boolean;
  setIsModalOpen: (state: boolean) => void;
}) {
  const socket = useContext(SocketioContext);
  const { enableDebug, disableDebug } = useContext(LoggerContext);
  const { playingClips, queuedClips, stoppingClips } = useContext(AbletonContext);

  function toggleSong(rfid: string, pillar: number, start: boolean) {
    // for (let i = 0; i < 4; i++) {
    //   if (start) {
    //     socket.emit('/new/tag', { rfid, pillar: i });
    //   } else {
    //     socket.emit('/departed/tag', { rfid, pillar: i });
    //   }
    // }
    if (start) {
      socket.emit('/new/tag', { rfid, pillar });
      // setTimeout(() => {
      //   socket.emit('/departed/tag', { rfid, pillar });
      // }, 100);
    } else {
      socket.emit('/departed/tag', { rfid, pillar });
    }
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  useEffect(() => {
    if (isModalOpen) {
      enableDebug();
      return disableDebug;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen]);

  /* <div className='absolute bottom-0 left-0 flex items-center justify-center'>
    <button
      type='button'
      onClick={openModal}
      className='rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75'
    >
      Open debug
    </button>
  </div> */
  return (
    <Transition appear show={isModalOpen} as={Fragment}>
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
                <div className='overflow-scroll max-h-[calc(100vh-4rem)]'>
                  <div className='grid gap-8 grid-flow-col'>
                    {/* <div className='grid grid-flow-col gap-8 auto-cols-max px-6 w-full max-w-screen max-h-[calc(100vh-8rem)] overflow-scroll'> */}
                    {[1, 2, 3, 4].map((pillar, index) => {
                      const stopping = Boolean(stoppingClips[index]?.clipName);
                      const playingClip = stoppingClips[index] ?? playingClips[index];
                      const queuedClip = queuedClips[index];

                      return (
                        <div key={pillar} className='grid grid-flow-row auto-rows-max'>
                          <div className='sticky top-0 bg-white z-10 pt-4'>
                            <div className='text-lg'>Pillar {pillar}</div>
                            <div style={{ minHeight: 72 }}>
                              <div className='text-sm'>{stopping ? 'stopping' : 'playing'}:</div>
                              {playingClip && (
                                <div>
                                  <ClipButton
                                    stopping={stopping}
                                    playing={!stopping}
                                    clipName={playingClip.clipName}
                                    onClick={() => toggleSong(playingClip.rfid, index, false)}
                                  />
                                </div>
                              )}
                            </div>
                            <div style={{ minHeight: 72 }}>
                              <div className='text-sm'>queued:</div>
                              {queuedClip && (
                                <div>
                                  <ClipButton
                                    queued
                                    clipName={queuedClip.clipName}
                                    onClick={() =>
                                      toggleSong(
                                        ClipNameToInfoMap[queuedClip.clipName].rfid,
                                        index,
                                        false,
                                      )
                                    }
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                          <div className='grid gap-4'>
                            <hr />
                            {clips.map(({ rfid, clipName }) => {
                              const playing = playingClips[index]?.clipName === clipName;
                              const stopping = stoppingClips[index]?.clipName === clipName;
                              const queued = queuedClips[index]?.clipName === clipName;

                              return (
                                !stopping &&
                                !playing &&
                                !queued && (
                                  <ClipButton
                                    key={rfid}
                                    clipName={clipName}
                                    onClick={() => toggleSong(rfid, index, true)}
                                  />
                                )
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
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
  );
}
