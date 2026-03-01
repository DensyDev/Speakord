import { IPlayerQueue, PlayableTrack } from "..";

export class MemoryPlayerQueue implements IPlayerQueue {
    private readonly queues = new Map<string, PlayableTrack[]>();

    enqueue(sessionId: string, track: PlayableTrack): void {
        const queue = this.queues.get(sessionId) || [];
        queue.push(track);
        this.queues.set(sessionId, queue);
    }

    next(sessionId: string): PlayableTrack | undefined {
        const queue = this.queues.get(sessionId);
        if (!queue || queue.length === 0) return undefined;

        const track = queue.shift();
        
        if (queue.length === 0) {
            this.queues.delete(sessionId);
        }

        return track;
    }

    peek(sessionId: string): PlayableTrack | undefined {
        return this.queues.get(sessionId)?.[0];
    }

    clear(sessionId: string): void {
        this.queues.delete(sessionId);
    }

    size(sessionId: string): number {
        return this.queues.get(sessionId)?.length || 0;
    }

    empty(sessionId: string): boolean {
        return this.size(sessionId) === 0;
    }
}