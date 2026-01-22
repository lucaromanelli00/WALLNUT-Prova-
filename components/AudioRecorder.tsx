import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Trash2, Play, Pause, RefreshCw } from 'lucide-react';

interface AudioRecorderProps {
  id: string; // Unique ID for storage
  onSave: (base64: string) => void;
  savedAudio?: string;
  onDelete?: () => void;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({ id, onSave, savedAudio, onDelete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (savedAudio) {
      setAudioUrl(savedAudio);
    }
  }, [savedAudio]);

  const startTimer = () => {
    setRecordingTime(0);
    timerRef.current = window.setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64data = reader.result as string;
          setAudioUrl(base64data);
          onSave(base64data);
        };
        stream.getTracks().forEach(track => track.stop());
        stopTimer();
      };

      mediaRecorder.start();
      setIsRecording(true);
      startTimer();
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Impossibile accedere al microfono.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const togglePlayback = () => {
    if (!audioPlayerRef.current && audioUrl) {
      audioPlayerRef.current = new Audio(audioUrl);
      audioPlayerRef.current.onended = () => setIsPlaying(false);
    }

    if (audioPlayerRef.current) {
      if (isPlaying) {
        audioPlayerRef.current.pause();
      } else {
        audioPlayerRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleDelete = () => {
    if (confirm("Vuoi cancellare questa registrazione?")) {
      setAudioUrl(null);
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
        audioPlayerRef.current = null;
      }
      setIsPlaying(false);
      onSave('');
      if (onDelete) onDelete();
    }
  };

  // UI STATES
  
  // 1. Initial State (No audio)
  if (!audioUrl && !isRecording) {
    return (
      <button
        onClick={startRecording}
        className="flex items-center space-x-2 text-slate-400 hover:text-blue-600 transition-colors text-xs font-semibold group px-2 py-1 rounded-md hover:bg-blue-50"
      >
        <div className="p-1.5 rounded-full bg-slate-100 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
          <Mic size={14} />
        </div>
        <span>Rispondi con Audio</span>
      </button>
    );
  }

  // 2. Recording State
  if (isRecording) {
    return (
      <div className="flex items-center justify-between w-full bg-red-50 border border-red-100 rounded-lg p-2 animate-pulse">
        <div className="flex items-center space-x-2 text-red-600">
          <div className="w-2 h-2 bg-red-600 rounded-full"></div>
          <span className="text-xs font-bold font-mono">{formatTime(recordingTime)}</span>
        </div>
        <button
          onClick={stopRecording}
          className="flex items-center space-x-1 px-3 py-1 bg-white shadow-sm text-red-600 rounded-md text-xs font-bold hover:bg-red-50 transition-colors"
        >
          <Square size={12} fill="currentColor" />
          <span>Stop</span>
        </button>
      </div>
    );
  }

  // 3. Playback State
  return (
    <div className="flex items-center justify-between w-full bg-blue-50 border border-blue-100 rounded-lg p-2">
      <div className="flex items-center space-x-3">
        <button
          onClick={togglePlayback}
          className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors shadow-sm"
        >
          {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" className="ml-0.5" />}
        </button>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-blue-800">Nota Vocale</span>
          <span className="text-[10px] text-blue-600 font-medium">Registrata</span>
        </div>
      </div>
      <button
        onClick={handleDelete}
        className="p-2 text-slate-400 hover:text-red-500 transition-colors rounded-full hover:bg-white"
        title="Cancella audio"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};
