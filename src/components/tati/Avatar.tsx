import avatarSheet from "@/assets/tati-avatars.png.asset.json";
import { cn } from "@/lib/utils";

/** The uploaded artwork is a 3x3 sheet of nine child avatars. */
export const AVATAR_KEYS = [
  "ama",
  "kojo",
  "esi",
  "kwame",
  "yaw",
  "abena",
  "kofi",
  "efua",
  "kwesi",
] as const;

export type AvatarKey = (typeof AVATAR_KEYS)[number];

const sizes = { sm: 40, md: 56, lg: 88, xl: 120 } as const;

export function Avatar({
  avatar = "ama",
  name,
  size = "md",
  ring,
  className,
}: {
  avatar?: AvatarKey | string;
  name?: string;
  size?: keyof typeof sizes;
  ring?: "primary" | "success" | "accent";
  className?: string;
}) {
  const index = Math.max(0, AVATAR_KEYS.indexOf(avatar as AvatarKey));
  const col = index % 3;
  const row = Math.floor(index / 3);
  const px = sizes[size];

  return (
    <span
      role="img"
      aria-label={name ? `${name}'s avatar` : "Learner avatar"}
      className={cn(
        "inline-block shrink-0 overflow-hidden rounded-full bg-secondary",
        ring === "primary" && "ring-4 ring-primary",
        ring === "success" && "ring-4 ring-success",
        ring === "accent" && "ring-4 ring-accent",
        className,
      )}
      style={{
        width: px,
        height: px,
        backgroundImage: `url(${avatarSheet.url})`,
        backgroundSize: "300% 300%",
        backgroundPosition: `${col * 50}% ${row * 50}%`,
      }}
    />
  );
}
