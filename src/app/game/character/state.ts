export enum State {
    Idle,
    IdleToTrackingTransition,
    TrackingToIdleTransition,
    Tracking,
    TrackingToInRangeTransition,
    InHitRange
}