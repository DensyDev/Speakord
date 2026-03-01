import { VoiceConnection } from "@discordjs/voice";
import { DiscordAudioPlayer, IAudioListener, IAudioPlayer, IPlayerQueue, PlayableTrack } from "../player";

export class PlaybackService {
    private players = new Map<string, IAudioPlayer>();
    private isProcessing = new Map<string, boolean>();

    constructor(public playerQueue: IPlayerQueue) {}

    async addAndPlay(sessionId: string, connection: VoiceConnection, track: PlayableTrack, listener?: IAudioListener) {
        this.playerQueue.enqueue(sessionId, track);
        
        if (!this.players.has(sessionId)) {
            this.players.set(sessionId, new DiscordAudioPlayer(connection));
        }

        if (!this.isProcessing.get(sessionId)) {
            await this.processQueue(sessionId, listener);
        }
    }

    async skipPlayback(sessionId: string, listener?: IAudioListener) {
        let player = this.players.get(sessionId);
        if (!player) return;

        if (player.isPlaying) {
            player.stop();
        }

        await this.processQueue(sessionId, listener);
    }

    private async processQueue(sessionId: string, listener?: IAudioListener): Promise<void> {
        const player = this.players.get(sessionId);
        if (!player) return;

        const nextTrack = this.playerQueue.next(sessionId);

        if (!nextTrack) {
            this.isProcessing.set(sessionId, false);
            return;
        }

        this.isProcessing.set(sessionId, true);

        try {
            await player.play(nextTrack, listener);
        } catch (error) {
            console.error(`Error playing track in guild ${sessionId}:`, error);
        }

        return this.processQueue(sessionId);
    }

    stopAndClear(sessionId: string) {
        const player = this.players.get(sessionId);
        player?.stop();
        this.players.delete(sessionId);
        this.playerQueue.clear(sessionId);
        this.isProcessing.set(sessionId, false);
    }
}