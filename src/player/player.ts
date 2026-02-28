export interface PlayableTrack {
    buffer: Buffer;
}

export interface IAudioPlayer {
    play(track: PlayableTrack): Promise<void>;
    stop(): void;
    pause(): void;
    resume(): void;
    isPlaying: boolean;
}

export interface IPlayerQueue {
    enqueue(sessionId: string, track: PlayableTrack): void;
    next(sessionId: string): PlayableTrack | undefined;
    peek(sessionId: string): PlayableTrack | undefined;
    clear(sessionId: string): void;
    size(sessionId: string): number;
    empty(sessionId: string): boolean;
}