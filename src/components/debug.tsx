/* eslint-disable no-console */
import { Fragment, useState, useContext, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';

import { SocketioContext } from '../contexts/socketio-provider';
import useCountdown from '../hooks/use-countdown';

export default function DebugModal() {
  const socket = useContext(SocketioContext);
  const { countdown, resetCountdown } = useCountdown();
  const [tracks, setTracks] = useState<Array<string | null>>();
  const [clips, setClips] = useState<Array<Array<string | null>>>();
  const [triggeredClips, setTriggeredClips] = useState<Record<number, string>>({});
  const [playingClips, setPlayingClips] = useState<Record<number, string>>({});

  const [isOpen, setIsOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const socketStatus = socket?.connected ? 'connected' : 'not connected';

  useEffect(() => {
    if (socket.connected && isOpen) {
      setIsRefreshing(true);
      setClips([]);
      setTracks([]);
      socket.emit('get_clip_list', null, (clips: Array<Array<string | null>>) => {
        setClips(clips);
        if (tracks?.length) setIsRefreshing(false);
      });
      socket.emit('get_track_names', null, (tracks: Array<string | null>) => {
        setTracks(tracks);
        if (clips?.length) setIsRefreshing(false);
      });
    }
  }, [socket, isOpen]);

  useEffect(() => {
    if (socket.connected) {
      // socket.on('clip_list', (clips: Array<Array<string | null>>) => {
      //   // console.log('clip_list fired:', clips)
      //   setClips(clips);
      // });
      // socket.on('track_names', (tracks: Array<string | null>) => {
      //   // console.log('track_names fired:', tracks)
      //   setTracks(tracks);
      // });

      socket.on('clip_is_queued', ({ clip, track }: { clip: string; track: string }) => {
        console.log('clip_triggered fired:', clip);
        setTriggeredClips((triggered) => ({ ...triggered, [track]: clip }));
        // setTtr(15);
        resetCountdown();
      });

      socket.on('clip_is_playing', ({ clip, track }: { clip: string; track: string }) => {
        console.log('clip_is_playing fired:', clip);
        setTriggeredClips((triggered) => ({ ...triggered, [track]: null }));
        setPlayingClips((playing) => ({ ...playing, [track]: clip }));
        resetCountdown();
      });
    }
  }, [socket]);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <>
      <div className="absolute bottom-0 left-0 flex items-center justify-center">
        <button
          type="button"
          onClick={openModal}
          className="rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
        >
          Open debug
        </button>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-xxl transform overflow-scroll rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex flex-row gap-8 mb-5 sticky left-0">
                    <p className="text-xl">Socket: {socketStatus}</p>
                    <p className="text-xl">
                      Clips: {isRefreshing ? 'loading' : tracks?.length && clips?.length ? 'loaded' : 'not loaded'}
                    </p>
                    <p className="text-xl">Reset timer: {countdown}s</p>
                  </div>

                  <div className="grid grid-flow-col gap-8 auto-cols-max">
                    {tracks?.slice(0, 6).map((track, column) => (
                      <div key={track} className="grid grid-flow-row auto-rows-max">
                        <div>{track}</div>
                        {clips?.[column]
                          ?.filter((name) => name)
                          .map((name, index) => {
                            const queued = triggeredClips[column ?? ''] === name;
                            const playing = playingClips[column ?? ''] === name;
                            return (
                              <div key={`${name} - ${index}`} className={playing ? 'active' : queued ? 'queued' : ''}>
                                {name}
                              </div>
                            );
                          })}
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 sticky left-0">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      Got it, thanks!
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
