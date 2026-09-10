/**
 * Central static asset hashmap for the LearnEarn app.
 * Every image / logo / remote media used in the project MUST come from here.
 */
export const files = {
  /** Circular profile avatar shown in the top navigation bar. */
  userAvatar:
    "https://images.unsplash.com/photo-1600486913747-55e5470d6f40?w=200&h=200&fit=crop&crop=faces",
  /** Secondary avatar used inside the slide-out account menu. */
  userAvatarLarge:
    "https://images.unsplash.com/photo-1600486913747-55e5470d6f40?w=400&h=400&fit=crop&crop=faces",
} as const;

export type AssetKey = keyof typeof files;
