import React, { useState } from "react";
import {
  ContractorProfile,
  PointsLedgerEntry,
  RewardCatalogItem,
  createLedgerDebit,
  wpRestClient,
} from "@aether/core-engine";
import { CheckCircle, Gift } from "@phosphor-icons/react";

interface Props {
  rewards: RewardCatalogItem[];
  contractor: ContractorProfile;
  onRedemption: (entry: PointsLedgerEntry, updatedContractor: ContractorProfile) => void;
  onSyncComplete?: () => void;
}

export const RewardsStoreGrid: React.FC<Props> = ({
  rewards,
  contractor,
  onRedemption,
  onSyncComplete,
}) => {
  const [voucherNotice, setVoucherNotice] = useState<{ title: string; code: string } | null>(null);

  const handleRedeem = async (item: RewardCatalogItem) => {
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

    await wpRestClient.dispatchWithFallback(
      "/wp-json/aether/v1/volt-redeem",
      "POST",
      {
        reward_title: item.title,
        reward_sku: item.sku,
        points_cost: item.pointsCost,
      },
      {
        success: true,
        voucher_code: voucherCode,
        points_spent: item.pointsCost,
        new_balance: updatedBalance,
      },
      { appKey: "voltswitch" }
    );

    const updated = {
      ...contractor,
      currentPointsBalance: updatedBalance,
    };

    onRedemption(entry, updated);
    onSyncComplete?.();
    setVoucherNotice({ title: item.title, code: voucherCode });
  };

  return (
    <div className="bg-volt-tray rounded-[20px] p-1.5 border border-white/[0.08]">
      <div className="bg-volt-surface rounded-[14px] p-5 border border-white/[0.06] space-y-4 text-xs">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
          <div className="flex items-center space-x-2">
            <Gift size={17} className="text-volt-amber" weight="fill" />
            <h2 className="font-bold text-sm text-volt-ink tracking-tight">Trade Loyalty Rewards Catalog</h2>
          </div>
          <span className="text-xs text-volt-muted">
            Available Balance:{" "}
            <strong className="font-mono text-volt-amber tabular-nums">
              {contractor.currentPointsBalance.toLocaleString()} pts
            </strong>
          </span>
        </div>

        {voucherNotice && (
          <div className="p-3.5 bg-emerald-950/60 border border-emerald-500/40 rounded-[12px] space-y-1.5">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold">
              <CheckCircle size={16} weight="fill" />
              <span>Reward Claimed: {voucherNotice.title}</span>
            </div>
            <div className="text-xs text-volt-ink">
              Redemption Voucher:{" "}
              <strong className="font-mono text-white text-xs bg-volt-base px-2.5 py-0.5 rounded-[6px] border border-emerald-500/40">
                {voucherNotice.code}
              </strong>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {rewards.map((reward) => {
            const canAfford = contractor.currentPointsBalance >= reward.pointsCost;
            return (
              <div
                key={reward.id}
                className="p-4 bg-volt-recessed rounded-[14px] border border-white/[0.06] hover:border-white/[0.14] flex flex-col justify-between space-y-4 transition-colors duration-200"
              >
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-volt-elevated text-volt-muted border border-white/[0.06]">
                      {reward.category.replace(/_/g, " ")}
                    </span>
                    <span className="text-[11px] font-mono text-volt-dim">{reward.brand}</span>
                  </div>
                  <h3 className="font-bold text-volt-ink text-sm mt-2.5 tracking-tight">{reward.title}</h3>
                  <p className="text-xs text-volt-muted mt-1 line-clamp-2 leading-relaxed">{reward.description}</p>
                </div>

                <div className="pt-3 border-t border-white/[0.06] space-y-2.5">
                  <div className="flex justify-between items-baseline">
                    <span className="font-mono text-volt-amber font-bold text-sm tabular-nums">
                      {reward.pointsCost.toLocaleString()} pts
                    </span>
                    <span className="text-[11px] font-mono text-volt-dim tabular-nums">
                      ${reward.audEquivalentValue} AUD
                    </span>
                  </div>

                  <button
                    type="button"
                    disabled={!canAfford}
                    onClick={() => handleRedeem(reward)}
                    className={`w-full min-h-[38px] py-1.5 rounded-full font-bold text-xs transition-all duration-200 ease-spring active:scale-[0.98] ${
                      canAfford
                        ? "bg-volt-elevated hover:bg-volt-amber hover:text-volt-base text-volt-ink border border-white/[0.1]"
                        : "bg-volt-base text-volt-dim border border-white/[0.04] cursor-not-allowed"
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
    </div>
  );
};
