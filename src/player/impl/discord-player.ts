import { IAudioListener, IAudioPlayer, PlayableTrack } from "..";
import { 
    createAudioPlayer, 
    createAudioResource, 
    AudioPlayer, 
    AudioPlayerStatus, 
    VoiceConnection 
} from '@discordjs/voice';
import { Readable } from 'stream';

export class DiscordAudioPlayer implements IAudioPlayer {
    private readonly player: AudioPlayer;
    public isPlaying = false;

    constructor(private connection: VoiceConnection) {
        this.player = createAudioPlayer();
        this.connection.subscribe(this.player);

        this.player.on(AudioPlayerStatus.Playing, () => {
            this.isPlaying = true;
        });

        this.player.on(AudioPlayerStatus.Idle, () => {
            this.isPlaying = false;
        });
    }

    async play(track: PlayableTrack, listener?: IAudioListener): Promise<void> {
        return new Promise((resolve, reject) => {
            const resource = createAudioResource(Readable.from(track.buffer));
            
            this.isPlaying = true;
            this.player.play(resource);

            const onStateChange = (oldState: any, newState: any) => {
                if (newState.status === AudioPlayerStatus.Idle) {
                    this.player.removeListener('stateChange', onStateChange);
                    this.isPlaying = false;
                    if (listener?.onStop) {
                        listener.onStop();
                    }
                    resolve();
                } else {
                    if (listener?.onPlay) {
                        listener.onPlay();
                    }
                }
            };

            const onError = (error: Error) => {
                this.player.removeListener('error', onError);
                this.isPlaying = false;
                if (listener?.onStop) {
                    listener.onStop();
                }
                reject(error);
            };

            this.player.on('stateChange', onStateChange);
            this.player.on('error', onError);
        });
    }

    stop(): void {
        this.player.stop();
        this.isPlaying = false;
    }

    pause(): void {
        this.player.pause();
        this.isPlaying = false;
    }

    resume(): void {
        this.player.unpause();
        this.isPlaying = true;
    }
}