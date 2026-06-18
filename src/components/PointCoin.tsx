interface PointCoinProps {
  size?: number;
  showText?: boolean;
  points?: number;
}

function PointCoin({
  size = 20,
  showText = false,
  points,
}: PointCoinProps) {
  return (
    <div className="flex items-center gap-2">
      <img
        src="/img/point-coin.png"
        alt="Point Coin"
        width={size}
        height={size}
        className="shrink-0 object-contain"
      />

      {showText && points !== undefined && (
        <span className="font-bold text-card-foreground">
          {points.toLocaleString()}
        </span>
      )}
    </div>
  );
}

export default PointCoin;