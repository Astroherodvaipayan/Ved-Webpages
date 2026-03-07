// app/utils/scrollSnap.ts

let globalSnapInProgress = false;
let lastSnapTimestamp = 0;
const sectionEntranceTimes = new Map<string, number>();
let currentSnapTargetId: string | null = null;
let isProgrammaticScrollActive = false;

// Section-specific locks: prevents a section from snapping immediately after being snapped TO
const lockedSections = new Map<string, number>();
const SECTION_LOCK_DURATION_MS = 1500; // How long a section is locked after being snapped to

export const SNAP_COOLDOWN_MS = 1000;
export const ENTRANCE_DELAY_MS = 800;
export const MIN_SCROLL_DISTANCE_PX = 24;

export function setSnapTarget(sectionId: string): void {
    currentSnapTargetId = sectionId;
}

export function clearSnapTarget(): void {
    currentSnapTargetId = null;
}

export function getSnapTarget(): string | null {
    return currentSnapTargetId;
}

export function startProgrammaticScroll(): void {
    isProgrammaticScrollActive = true;
}

export function endProgrammaticScroll(): void {
    isProgrammaticScrollActive = false;
}

export function isProgrammaticScrollInProgress(): boolean {
    return isProgrammaticScrollActive;
}

// Lock a section from snapping (called when we snap TO it)
export function lockSection(sectionId: string): void {
    lockedSections.set(sectionId, Date.now());
}

// Check if a section is currently locked
export function isSectionLocked(sectionId: string): boolean {
    const lockTime = lockedSections.get(sectionId);
    if (!lockTime) return false;
    if (Date.now() - lockTime > SECTION_LOCK_DURATION_MS) {
        lockedSections.delete(sectionId);
        return false;
    }
    return true;
}

export function isSnapAllowed(): boolean {
    const now = Date.now();
    return !globalSnapInProgress && now - lastSnapTimestamp > SNAP_COOLDOWN_MS;
}

export function lockSnap(): void {
    globalSnapInProgress = true;
    lastSnapTimestamp = Date.now();
}

export function unlockSnap(): void {
    globalSnapInProgress = false;
}

export function isSnapInProgress(): boolean {
    return globalSnapInProgress;
}

export function recordSectionEntrance(sectionId: string): void {
    sectionEntranceTimes.set(sectionId, Date.now());
}

export function hasEntranceDelayElapsed(sectionId: string): boolean {
    const entranceTime = sectionEntranceTimes.get(sectionId);
    if (!entranceTime) return true;
    return Date.now() - entranceTime > ENTRANCE_DELAY_MS;
}

export function shouldSnap(
    self: { start: number; end: number; direction: number; progress: number },
    completeProgress: number,
    bufferPx: number,
    isSnapping: React.MutableRefObject<boolean>,
    hasTriggered: React.MutableRefObject<boolean>,
    sectionId?: string,
): boolean {
    const totalScrollDistance = self.end - self.start;
    if (totalScrollDistance <= MIN_SCROLL_DISTANCE_PX) {
        return false;
    }

    const completePosition = self.start + totalScrollDistance * completeProgress;
    const currentScroll = typeof window !== "undefined" ? window.scrollY : 0;
    const triggerPosition = completePosition + bufferPx;

    const entranceDelayOk = sectionId ? hasEntranceDelayElapsed(sectionId) : true;

    // Block ALL sections from snapping during any programmatic scroll
    if (isProgrammaticScrollActive) {
        return false;
    }

    // If this section is locked (was just snapped to), block it
    if (sectionId && isSectionLocked(sectionId)) {
        return false;
    }

    // If there's a current snap target and it's NOT this section, don't snap
    const isIntendedTarget = !currentSnapTargetId || currentSnapTargetId === sectionId;

    return (
        currentScroll >= triggerPosition &&
        self.direction === 1 &&
        !isSnapping.current &&
        !hasTriggered.current &&
        isSnapAllowed() &&
        entranceDelayOk &&
        isIntendedTarget
    );
}

export function snapToSection(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    lenis: any,
    nextSectionId: string,
    duration: number,
    isSnapping: React.MutableRefObject<boolean>,
    hasTriggered: React.MutableRefObject<boolean>,
): void {
    if (!lenis) return;

    isSnapping.current = true;
    hasTriggered.current = true;
    lockSnap();

    const nextSection = document.getElementById(nextSectionId);

    if (!nextSection) {
        console.warn(`[scrollSnap] Section "${nextSectionId}" not found`);
        isSnapping.current = false;
        unlockSnap();
        return;
    }

    const targetY = nextSection.getBoundingClientRect().top + window.scrollY;

    // Set target and mark scroll as active BEFORE scrolling
    setSnapTarget(nextSectionId);
    startProgrammaticScroll();

    // Lock the TARGET section so it doesn't immediately fire its own snap
    lockSection(nextSectionId);

    lenis.scrollTo(targetY, {
        duration,
        force: true,
        lock: true,
        easing: (t: number) => 1 - Math.pow(1 - t, 3),
        onComplete: () => {
            recordSectionEntrance(nextSectionId);

            setTimeout(() => {
                endProgrammaticScroll();
                clearSnapTarget();
                isSnapping.current = false;
                unlockSnap();
            }, 500);
        },
    });
}
