/**
 * Audio Generator & Helper Utilities for ReadHeal
 * Generates playable soothing WAV audio data in browser via Web Audio API,
 * allowing instant HTML5 audio playback for all sample stories,
 * volunteer uploaded files, and preview clips.
 */

// Generate a valid soothing WAV audio Blob URL with harmonic healing tones
export function generateHealingWavAudioUrl(
  toneType: 'piano' | 'singing_bowl' | 'gentle_chime' | 'bedside_whisper' | 'nature' = 'piano',
  durationSeconds: number = 30
): string {
  try {
    const sampleRate = 22050; // Compact sample rate for quick in-memory generation
    const numSamples = Math.min(sampleRate * durationSeconds, sampleRate * 45);
    const buffer = new ArrayBuffer(44 + numSamples * 2);
    const view = new DataView(buffer);

    // RIFF identifier
    writeString(view, 0, 'RIFF');
    // File length
    view.setUint32(4, 36 + numSamples * 2, true);
    // RIFF type
    writeString(view, 8, 'WAVE');
    // Format chunk identifier
    writeString(view, 12, 'fmt ');
    // Format chunk length
    view.setUint32(16, 16, true);
    // Sample format (1 = PCM)
    view.setUint16(20, 1, true);
    // Channels (1 = Mono)
    view.setUint16(22, 1, true);
    // Sample rate
    view.setUint32(24, sampleRate, true);
    // Byte rate (sampleRate * channels * bytesPerSample)
    view.setUint32(28, sampleRate * 2, true);
    // Block align (channels * bytesPerSample)
    view.setUint16(32, 2, true);
    // Bits per sample
    view.setUint16(34, 16, true);
    // Data chunk identifier
    writeString(view, 36, 'data');
    // Data chunk length
    view.setUint32(40, numSamples * 2, true);

    // Frequencies (Hz) for soothing hospital healing harmony (F# minor / A major pentatonic 432Hz tuning)
    const baseFreqs = toneType === 'singing_bowl'
      ? [216, 432, 648]
      : toneType === 'gentle_chime'
      ? [540, 720, 864, 1080]
      : toneType === 'nature'
      ? [320, 384, 480, 576]
      : [256.87, 323.63, 384.87, 432.0, 513.74];

    // Write PCM samples
    let offset = 44;
    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate;
      
      // Calculate notes shifting every 3-4 seconds
      const noteIdx = Math.floor(t / 2.5) % baseFreqs.length;
      const freq = baseFreqs[noteIdx];
      const nextFreq = baseFreqs[(noteIdx + 1) % baseFreqs.length];

      // Note envelope (soft attack, decay)
      const notePhase = (t % 2.5) / 2.5;
      const noteEnv = Math.sin(notePhase * Math.PI) * Math.exp(-notePhase * 1.5);

      // Warm sine + soft harmonic
      let sample = Math.sin(2 * Math.PI * freq * t) * 0.7;
      sample += Math.sin(2 * Math.PI * nextFreq * 0.5 * t) * 0.25;
      sample += Math.sin(2 * Math.PI * (freq * 2) * t) * 0.1;

      // Overall song fade in / fade out
      const overallFade = Math.min(t / 1.5, 1) * Math.min((durationSeconds - t) / 2, 1);
      const finalSample = sample * noteEnv * overallFade * 0.65;

      // Clip to 16-bit PCM range [-32768, 32767]
      const clamped = Math.max(-1, Math.min(1, finalSample));
      view.setInt16(offset, clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff, true);
      offset += 2;
    }

    const blob = new Blob([view], { type: 'audio/wav' });
    return URL.createObjectURL(blob);
  } catch (err) {
    console.warn('Fallback audio generation:', err);
    // Silent valid 1-sec wav data url fallback
    return 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAP8A/w==';
  }
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

// Format seconds into MM:SS
export function formatDurationSeconds(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Format file size into readable KB/MB
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

// Measure actual duration of an audio file via HTML5 Audio
export function getAudioFileDuration(file: File): Promise<{ durationSeconds: number; durationFormatted: string; url: string }> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const audio = new Audio();
    audio.src = url;

    const onLoaded = () => {
      const duration = Math.round(audio.duration) || 180;
      resolve({
        durationSeconds: duration,
        durationFormatted: formatDurationSeconds(duration),
        url,
      });
      cleanup();
    };

    const onError = () => {
      // Fallback estimate based on file size (avg 128kbps = 16KB/sec)
      const estimatedSecs = Math.max(30, Math.round(file.size / 16000));
      resolve({
        durationSeconds: estimatedSecs,
        durationFormatted: formatDurationSeconds(estimatedSecs),
        url,
      });
      cleanup();
    };

    const cleanup = () => {
      audio.removeEventListener('loadedmetadata', onLoaded);
      audio.removeEventListener('error', onError);
    };

    audio.addEventListener('loadedmetadata', onLoaded);
    audio.addEventListener('error', onError);

    // Timeout safety
    setTimeout(() => {
      if (audio.readyState === 0) {
        onError();
      }
    }, 2500);
  });
}
