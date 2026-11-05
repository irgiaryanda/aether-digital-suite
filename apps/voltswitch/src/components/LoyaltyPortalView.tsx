import React from "react";
import {
  ContractorProfile,
  PointsLedgerEntry,
  RewardCatalogItem,
} from "@aether/core-engine";
import { InvoiceClaimForm } from "./InvoiceClaimForm";
import { PointsLedgerTable } from "./PointsLedgerTable";
import { RewardsStoreGrid } from "./RewardsStoreGrid";

interface Props {
  contractor: ContractorProfile;
  ledger: PointsLedgerEntry[];
  rewards: RewardCatalogItem[];
  onLedgerUpdate: (entry: PointsLedgerEntry, updatedContractor: ContractorProfile) => void;
}

export const LoyaltyPortalView: React.FC<Props> = ({
  contractor,
  ledger,
  rewards,
  onLedgerUpdate,
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5">
          <InvoiceClaimForm
            contractor={contractor}
            existingLedger={ledger}
            onClaimSubmitted={onLedgerUpdate}
          />
        </div>
        <div className="lg:col-span-7">
          <PointsLedgerTable ledger={ledger} />
        </div>
      </div>

      <RewardsStoreGrid
        rewards={rewards}
        contractor={contractor}
        onRedemption={onLedgerUpdate}
      />
    </div>
  );
};
