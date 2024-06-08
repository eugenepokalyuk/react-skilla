import React, { useEffect, useRef, useState } from 'react';
import IconClose from '../../assets/icons/close.svg';
import IconDownload from '../../assets/icons/download.svg';
import IconPause from '../../assets/icons/pause.svg';
import IconPlay from '../../assets/icons/play.svg';
import './CustomAudioPlayer.scss';

interface CustomAudioPlayerProps {
    src: string;
    onPlay: () => void;
    onClose: () => void;
}

const CustomAudioPlayer: React.FC<CustomAudioPlayerProps> = ({ src, onPlay, onClose }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            const setAudioData = () => {
                setDuration(audio.duration);
                setCurrentTime(audio.currentTime);
            }

            const setAudioTime = () => setCurrentTime(audio.currentTime);

            audio.addEventListener('loadeddata', setAudioData);
            audio.addEventListener('timeupdate', setAudioTime);

            return () => {
                audio.removeEventListener('loadeddata', setAudioData);
                audio.removeEventListener('timeupdate', setAudioTime);
            };
        }
    }, [src]);

    const togglePlayPause = () => {
        const audio = audioRef.current;
        if (audio) {
            if (isPlaying) {
                audio.pause();
            } else {
                audio.play().then(() => onPlay()).catch(error => console.error('Error playing audio:', error));
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = src;
        link.download = 'recording.mp3';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleTimeUpdate = (event: React.ChangeEvent<HTMLInputElement>) => {
        const audio = audioRef.current;
        if (audio) {
            const newTime = Number(event.target.value);
            audio.currentTime = newTime;
            setCurrentTime(newTime);
        }
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="audio-player">
            {/* Музыку которую присылает АПИ воспроизвести нельзя */}
            <audio ref={audioRef} src={src} />
            <div className="controls">
                <span>{formatTime(currentTime)}</span>
                <button className='buttonPlayPause' onClick={togglePlayPause}>
                    {isPlaying
                        ? <img src={IconPause} alt="pause icon" />
                        : <img src={IconPlay} alt="play icon" />
                    }
                </button>
                <input
                    type="range"
                    min="0"
                    max={duration}
                    value={currentTime}
                    onChange={handleTimeUpdate}
                />
                <span>{formatTime(duration)}</span>
                <button onClick={handleDownload} className="download">
                    <img src={IconDownload} alt="download icon" />
                </button>
                <button onClick={onClose} className="close">
                    <img src={IconClose} alt="close icon" />
                </button>
            </div>
        </div>
    );
};

export default CustomAudioPlayer;