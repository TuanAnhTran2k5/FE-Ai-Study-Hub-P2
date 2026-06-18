import BronzeAvatarFrame from "./BronzeAvatarFrame";
import SilverAvatarFrame from "./SilverAvatarFrame";
import GoldAvatarFrame from "./GoldAvatarFrame";
import EliteAvatarFrame from "./EliteAvatarFrame";

interface AvatarFrameProps {
  score: number;
  avatarUrl?: string;
  fullName?: string;
  size?: "sm" | "md" | "lg";
}

function AvatarFrame({
  score,
  avatarUrl,
  fullName,
  size = "md",
}: AvatarFrameProps) {
  if (score >= 701) {
    return (
      <EliteAvatarFrame
        avatarUrl={avatarUrl}
        fullName={fullName}
        size={size}
      />
    );
  }

  if (score >= 301) {
    return (
      <GoldAvatarFrame
        avatarUrl={avatarUrl}
        fullName={fullName}
        size={size}
      />
    );
  }

  if (score >= 101) {
    return (
      <SilverAvatarFrame
        avatarUrl={avatarUrl}
        fullName={fullName}
        size={size}
      />
    );
  }

  return (
    <BronzeAvatarFrame
      avatarUrl={avatarUrl}
      fullName={fullName}
      size={size}
    />
  );
}

export default AvatarFrame;