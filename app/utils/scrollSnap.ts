// app/utils/scrollSnap.ts

let globalSnapInProgress = false;
let lastSnapTimestamp = 0;
const sectionEntranceTimes = new Map<string, number>();
let currentSnapTargetId: string | null = null; // Track which section we're snapping TO
let isProgrammaticScrollActive = false; // Track if a programmatic scroll is in progress

export const SNAP_COOLDOWN_MS = 1000;
export const ENTRANCE_DELAY_MS = 3000; // Wait before allowing snap after entering section (increased to prevent recursive snapping)

// Set the target section we're snapping to - blocks other sections from snapping during this window
export function setSnapTarget(sectionId: string): void {
    currentSnapTargetId = sectionId;
}

// Clear the snap target after scroll completes
export function clearSnapTarget(): void {
    currentSnapTargetId = null;
}

// Get current snap target (for debugging)
export function getSnapTarget(): string | null {
    return currentSnapTargetId;
}

// Mark that a programmatic scroll has started
export function startProgrammaticScroll(): void {
    isProgrammaticScrollActive = true;
}

// Mark that a programmatic scroll has completed
export function endProgrammaticScroll(): void {
    isProgrammaticScrollActive = false;
}

// Check if a programmatic scroll is in progress
export function isProgrammaticScrollInProgress(): boolean {
    return isProgrammaticScrollActive;
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
    const completePosition = self.start + totalScrollDistance * completeProgress;
    const currentScroll = typeof window !== "undefined" ? window.scrollY : 0;
    const triggerPosition = completePosition + bufferPx;

    const entranceDelayOk = sectionId ? hasEntranceDelayElapsed(sectionId) : true;

    // If there's a current snap target and it's this section, we're the target of a programmatic scroll
    // Don't snap until the scroll completes
    const isTargetOfProgrammaticScroll = currentSnapTargetId === sectionId;

    // If we're the target of a programmatic scroll, block snapping until it completes
    if (isProgrammaticScrollActive && isTargetOfProgrammaticScroll) {
        console.log(`[shouldSnap] BLOCKED - ${sectionId}: programmatic scroll in progress to this section`);
        return false;
    }

    // If there's a current snap target and it's NOT this section, don't snap
    const isIntendedTarget = !currentSnapTargetId || currentSnapTargetId === sectionId;

    // Debug log
    if (sectionId) {
        const result = currentScroll >= triggerPosition &&
            self.direction === 1 &&
            !isSnapping.current &&
            !hasTriggered.current &&
            isSnapAllowed() &&
            entranceDelayOk &&
            isIntendedTarget;
        console.log(`[shouldSnap] ${sectionId}: target=${currentSnapTargetId} active=${isProgrammaticScrollActive} scrollPos=${currentScroll.toFixed(0)} triggerPos=${triggerPosition.toFixed(0)} dir=${self.direction} isSnapping=${isSnapping.current} hasTriggered=${hasTriggered.current} snapAllowed=${isSnapAllowed()} entranceOk=${entranceDelayOk} isIntended=${isIntendedTarget} RESULT=${result}`);
    }

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

    console.log(`[snapToSection] Starting snap to: ${nextSectionId}`);

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

    // Set target and mark scroll as active BEFORE scrolling to block other sections from snapping
    setSnapTarget(nextSectionId);
    startProgrammaticScroll();

    lenis.scrollTo(targetY, {
        duration,
        force: true,
        lock: true,
        easing: (t: number) => 1 - Math.pow(1 - t, 3),
        onComplete: () => {
            // Mark scroll as complete
            endProgrammaticScroll();
            // Clear target AFTER scroll completes
            clearSnapTarget();
            setTimeout(() => {
                isSnapping.current = false;
                unlockSnap();
            }, 500);
        },
    });
}