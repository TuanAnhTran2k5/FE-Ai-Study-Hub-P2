import BronzeAvatarFrame from "./BronzeAvatarFrame";
import SilverAvatarFrame from "./SilverAvatarFrame";
import GoldAvatarFrame from "./GoldAvatarFrame";
import EliteAvatarFrame from "./EliteAvatarFrame";

interface AvatarFrameProps {
  score: number;
  avatarUrl?: string | null;
  fullName?: string;
  size?: "sm" | "md" | "lg";
  isOnline?: boolean;
}

function AvatarFrame({
  score,
  avatarUrl,
  fullName,
  size = "md",
  isOnline = false,
}: AvatarFrameProps) {
  if (score >= 701) {
    return (
      <EliteAvatarFrame
        avatarUrl={avatarUrl}
        fullName={fullName}
        size={size}
        isOnline={isOnline}
      />
    );
  }

  if (score >= 301) {
    return (
      <GoldAvatarFrame
        avatarUrl={avatarUrl}
        fullName={fullName}
        size={size}
        isOnline={isOnline}
      />
    );
  }

  if (score >= 101) {
    return (
      <SilverAvatarFrame
        avatarUrl={avatarUrl}
        fullName={fullName}
        size={size}
        isOnline={isOnline}
      />
    );
  }

  return (
    <BronzeAvatarFrame
      avatarUrl={avatarUrl}
      fullName={fullName}
      size={size}
      isOnline={isOnline}
    />
  );
}

export default AvatarFrame;
