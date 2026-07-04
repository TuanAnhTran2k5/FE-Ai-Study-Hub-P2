import { Database } from "lucide-react";

import type { UserResponse } from "@/types/user.type";

interface ProfileStorageCardProps {
  user: UserResponse;
}

function formatStorage(bytes?: number | null) {
  const value = bytes ?? 0;

  if (value <= 0) return "0 B";

  if (value >= 1024 * 1024 * 1024) {
    return `${(value / 1024 / 1024 / 1024).toFixed(2)} GB`;
  }

  if (value >= 1024 * 1024) {
    return `${(value / 1024 / 1024).toFixed(2)} MB`;
  }

  if (value >= 1024) {
    return `${(value / 1024).toFixed(2)} KB`;
  }

  return `${value} B`;
}

function formatPercent(value?: number | null) {
  return `${Number(value ?? 0).toFixed(1)}%`;
}

function ProfileStorageCard({ user }: ProfileStorageCardProps) {
  const storageUsed = user.storageUsed ?? 0;
  const storageLimit = user.storageLimit ?? 0;
  const storageRemaining =
    user.storageRemaining ?? Math.max(storageLimit - storageUsed, 0);

  const storagePercent =
    user.storageUsagePercent ??
    (storageLimit > 0
      ? Math.min(100, Number(((storageUsed / storageLimit) * 100).toFixed(1)))
      : 0);

  return (
    <div className="rounded-3xl border border-border bg-secondary/50 p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Database className="h-5 w-5" />
        </div>

        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Cloud Storage
          </p>
          <p className="text-xs text-muted-foreground">
            Storage limit is provided by server rank policy.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StorageInfo label="Used" value={formatStorage(storageUsed)} highlight />
        <StorageInfo label="Limit" value={formatStorage(storageLimit)} />
        <StorageInfo label="Remaining" value={formatStorage(storageRemaining)} />
      </div>

      <div className="mt-5 h-3 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary-start to-primary-end"
          style={{ width: `${Math.min(100, storagePercent)}%` }}
        />
      </div>

      <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
        <span>{formatPercent(storagePercent)} used</span>
        <span>
          {formatStorage(storageUsed)} / {formatStorage(storageLimit)}
        </span>
      </div>
    </div>
  );
}

function StorageInfo({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card/40 p-4">
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>

      <p
        className={`mt-2 text-lg font-black ${
          highlight ? "text-primary" : "text-card-foreground"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

export default ProfileStorageCard;