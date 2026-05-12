import Image from "next/image";

type Props = {
  username: string;
  avatarUrl: string | null;
  size?: number;
  ring?: boolean;
};

export function MemberAvatar({ username, avatarUrl, size = 32, ring = true }: Props) {
  const dimension = `${size}px`;
  const ringClass = ring ? "ring-2 ring-ink-900" : "";
  if (!avatarUrl) {
    const initial = username[0]?.toUpperCase() ?? "?";
    return (
      <div
        className={`flex items-center justify-center rounded-full bg-ink-700 font-semibold text-ink-300 ${ringClass}`}
        style={{ width: dimension, height: dimension, fontSize: size * 0.4 }}
      >
        {initial}
      </div>
    );
  }
  return (
    <Image
      src={avatarUrl}
      alt={username}
      width={size}
      height={size}
      className={`rounded-full object-cover ${ringClass}`}
      unoptimized
    />
  );
}
