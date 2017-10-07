export interface AudioQueueItem {
    key: string;
    duration: number;
    offset: number;
    volume: number;
    loop?: boolean
}