import React from 'react';
import WaveSurfer from 'wavesurfer.js';
import Timeline from 'wavesurfer.js/dist/plugins/timeline';

interface TimelineProps {
  wavesurfer: WaveSurfer | null;
  zoom: number;
}

export const WaveformTimeline: React.FC<TimelineProps> = ({ wavesurfer, zoom }) => {
  React.useEffect(() => {
    if (!wavesurfer) return;

    const timelinePlugin = Timeline.create({
      container: '#timeline',
      primaryLabelInterval: zoom < 100 ? 10 : 1,
      secondaryLabelInterval: zoom < 100 ? 5 : 0.5,
      style: {
        fontSize: '12px',
        color: 'rgb(68, 68, 68)'
      },
      timeInterval: zoom < 50 ? 1 : 0.1,
      formatTimeCallback: (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        const ms = Math.floor((seconds % 1) * 1000);
        
        return zoom > 200 
          ? `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(ms).padStart(3, '0')}`
          : `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
      }
    });

    wavesurfer.registerPlugin(timelinePlugin);

    return () => {
      if (wavesurfer) {
        wavesurfer.unregisterPlugin('timeline');
      }
    };
  }, [wavesurfer, zoom]);

  return <div id="timeline" className="w-full h-[20px]" />;
};