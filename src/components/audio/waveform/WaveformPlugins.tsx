import React from 'react';
import WaveSurfer from 'wavesurfer.js';
import Minimap from 'wavesurfer.js/dist/plugins/minimap';
import Regions from 'wavesurfer.js/dist/plugins/regions';
import Spectrogram from 'wavesurfer.js/dist/plugins/spectrogram';
import { AudioSettings } from '@/types/audio/settings';

interface WaveformPluginsProps {
  wavesurfer: WaveSurfer | null;
  settings: AudioSettings;
  showSpectrogram: boolean;
  showRegions: boolean;
}

export const WaveformPlugins: React.FC<WaveformPluginsProps> = ({
  wavesurfer,
  settings,
  showSpectrogram,
  showRegions
}) => {
  React.useEffect(() => {
    if (!wavesurfer) return;

    // Initialize Minimap
    const minimap = Minimap.create({
      height: 20,
      waveColor: '#ddd',
      progressColor: '#999',
      container: '#minimap'
    });
    wavesurfer.registerPlugin(minimap);

    // Initialize Regions if enabled
    if (showRegions) {
      const regions = Regions.create();
      wavesurfer.registerPlugin(regions);
    }

    // Initialize Spectrogram if enabled
    if (showSpectrogram) {
      const spectrogram = Spectrogram.create({
        labels: true,
        height: 200,
        splitChannels: true,
        scale: 'mel',
        frequencyMax: 8000,
        frequencyMin: 0,
        fftSamples: 1024,
        labelsBackground: 'rgba(0, 0, 0, 0.1)',
        container: '#spectrogram'
      });
      wavesurfer.registerPlugin(spectrogram);
    }

    return () => {
      wavesurfer.destroyPlugin('minimap');
      wavesurfer.destroyPlugin('regions');
      wavesurfer.destroyPlugin('spectrogram');
    };
  }, [wavesurfer, showSpectrogram, showRegions]);

  return (
    <div className="space-y-2">
      <div id="minimap" className="w-full h-[20px]" />
      {showSpectrogram && <div id="spectrogram" className="w-full" />}
    </div>
  );
};