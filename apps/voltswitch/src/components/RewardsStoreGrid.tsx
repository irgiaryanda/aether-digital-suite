import React, { useState } from "react";
import {
  ContractorProfile,
  PointsLedgerEntry,
  RewardCatalogItem,
  createLedgerDebit,
} from "@aether/core-engine";
import { Gift, CheckCircle, Warning, Tag } from "@phosphor-icons/react";

interface Props {
  rewards: RewardCatalogItem[];
  contractor: ContractorProfile;
  onRedemption: (entry: PointsLedgerEntry, updatedContractor: ContractorProfile) => void;
}

export const RewardsStoreGrid: React.FC<Props> = ({
  rewards,
  contractor,
  onRedemption,
}) => {
  const [voucherNotice, setVoucherNotice] = useState<{ title: string; code: string } | null>(null);

  const handleRedeem = (item: RewardCatalogItem) => {
    if (contractor.currentPointsBalance < item.pointsCost) return;

    const voucherCode = `VCH-${item.category.slice(0, 4)}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const { updatedBalance, entry } = createLedgerDebit(
      contractor.contractorId,
      contractor.currentPointsBalance,
      item.pointsCost,
      "REWARD_REDEMPTION",
      voucherCode,
      `Redemption: ${item.title} ($${item.audEquivalentValue} AUD value)`
    );

    const updated = {
      ...contractor,
      currentPointsBalance: updatedBalance,
    };

    onRedemption(entry, updated);
    setVoucherNotice({ title: item.title, code: voucherCode });
  };

  return (
    <div className="bg-volt-surface rounded-xl border border-volt-border p-4 shadow-lg space-y-4 font-mono text-xs">
      <div className="flex items-center justify-between border-b border-volt-border pb-2.5">
        <div className="flex items-center space-x-2">
          <Gift size={16} className="text-volt-amber" weight="fill" />
          <h3 className="font-bold text-white">Trade Loyalty Rewards Catalog</h3>
        </div>
        <span className="text-[11px] text-gray-400">
          Balance: <strong className="text-volt-amber tabular-nums">{contractor.currentPointsBalance.toLocaleString()} pts</strong>
        </span>
      </div>

      {voucherNotice && (
        <div className="p-3 bg-emerald-950/60 border border-emerald-500/50 rounded-lg space-y-1">
          <div className="flex items-center space-x-1.5 text-emerald-400 font-bold">
            <CheckCircle size={16} weight="fill" />
            <span>Reward Claimed: {voucherNotice.title}</span>
          </div>
          <div className="text-[11px] text-gray-300">
            Redemption Voucher: <strong className="text-white text-xs bg-black px-2 py-0.5 rounded border border-emerald-500/40">{voucherNotice.code}</strong>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {rewards.map((reward) => {
          const canAfford = contractor.currentPointsBalance >= reward.pointsCost;
          return (
            <div
              key={reward.id}
              className="p-3 bg-volt-base rounded-lg border border-volt-border hover:border-volt-border/90 flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex justify-between items-start gap-1">
                  <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-volt-elevated text-gray-400 font-bold">
                    {reward.category.replace(/_/g, " ")}
                  </span>
                  <span className="text-[10px] text-gray-400">{reward.brand}</span>
                </div>
                <h4 className="font-bold text-white text-xs mt-2">{reward.title}</h4>
                <p className="text-[10px] text-gray-400 mt-1 line-clamp-2">{reward.description}</p>
              </div>

              <div className="pt-2 border-t border-volt-border/60 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-volt-amber font-bold text-sm tabular-nums">
                    {reward.pointsCost.toLocaleString()} pts
                  </span>
                  <span className="text-[10px] text-gray-500">
                    (${reward.audEquivalentValue} AUD)
                  </span>
                </div>

                <button
                  type="button"
                  disabled={!canAfford}
                  onClick={() => handleRedeem(reward)}
                  className={`w-full py-1.5 rounded font-bold text-[11px] transition-colors ${
                    canAfford
                      ? "bg-volt-elevated hover:bg-volt-amber hover:text-black text-white border border-volt-border"
                      : "bg-volt-base text-gray-600 border border-volt-border/30 cursor-not-allowed"
                  }`}
                >
                  {canAfford ? "Redeem Reward" : "Need More Pts"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
