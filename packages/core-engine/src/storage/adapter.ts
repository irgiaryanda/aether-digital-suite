import { AuraQuoteSubmission, GarageDoorConfig, PoolConfig } from "../aura/types";
import { DEFAULT_GARAGE_CONFIG, DEFAULT_POOL_CONFIG, SEEDED_AURA_QUOTES } from "../aura/aura-fixtures";
import {
  ContractorProfile,
  PointsLedgerEntry,
  RewardCatalogItem,
  WholesalerInvoiceClaim,
} from "../volt/types";
import {
  SEEDED_CONTRACTOR,
  SEEDED_INVOICE_CLAIMS,
  SEEDED_POINTS_LEDGER,
  SEEDED_TRADE_REWARDS,
} from "../volt/volt-fixtures";
import {
  ActiveTimerState,
  AgencyClient,
  ChronosProject,
  KanbanTask,
  TimesheetEntry,
} from "../chronos/types";
import {
  DEFAULT_ACTIVE_TIMER,
  SEEDED_CLIENTS,
  SEEDED_KANBAN_TASKS,
  SEEDED_PROJECTS,
  SEEDED_TIMESHEETS,
} from "../chronos/chronos-fixtures";

export interface AetherStorageSchema {
  aura: {
    quotes: AuraQuoteSubmission[];
    draftGarageConfig: GarageDoorConfig;
    draftPoolConfig: PoolConfig;
  };
  volt: {
    contractor: ContractorProfile;
    ledger: PointsLedgerEntry[];
    claims: WholesalerInvoiceClaim[];
    rewards: RewardCatalogItem[];
  };
  chronos: {
    clients: AgencyClient[];
    projects: ChronosProject[];
    tasks: KanbanTask[];
    timesheets: TimesheetEntry[];
    activeTimer: ActiveTimerState;
  };
}

const STORAGE_KEY = "AETHER_DIGITAL_SUITE_STORAGE_V1";

export class AetherStorageAdapter {
  private inMemoryFallback: AetherStorageSchema | null = null;

  constructor() {
    this.ensureInitialized();
  }

  private isLocalStorageAvailable(): boolean {
    try {
      return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
    } catch {
      return false;
    }
  }

  private getBaselineFixtures(): AetherStorageSchema {
    return {
      aura: {
        quotes: JSON.parse(JSON.stringify(SEEDED_AURA_QUOTES)),
        draftGarageConfig: JSON.parse(JSON.stringify(DEFAULT_GARAGE_CONFIG)),
        draftPoolConfig: JSON.parse(JSON.stringify(DEFAULT_POOL_CONFIG)),
      },
      volt: {
        contractor: JSON.parse(JSON.stringify(SEEDED_CONTRACTOR)),
        ledger: JSON.parse(JSON.stringify(SEEDED_POINTS_LEDGER)),
        claims: JSON.parse(JSON.stringify(SEEDED_INVOICE_CLAIMS)),
        rewards: JSON.parse(JSON.stringify(SEEDED_TRADE_REWARDS)),
      },
      chronos: {
        clients: JSON.parse(JSON.stringify(SEEDED_CLIENTS)),
        projects: JSON.parse(JSON.stringify(SEEDED_PROJECTS)),
        tasks: JSON.parse(JSON.stringify(SEEDED_KANBAN_TASKS)),
        timesheets: JSON.parse(JSON.stringify(SEEDED_TIMESHEETS)),
        activeTimer: JSON.parse(JSON.stringify(DEFAULT_ACTIVE_TIMER)),
      },
    };
  }

  public ensureInitialized(): void {
    if (this.isLocalStorageAvailable()) {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.getBaselineFixtures()));
      }
    } else {
      if (!this.inMemoryFallback) {
        this.inMemoryFallback = this.getBaselineFixtures();
      }
    }
  }

  public getState(): AetherStorageSchema {
    if (this.isLocalStorageAvailable()) {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        try {
          return JSON.parse(raw) as AetherStorageSchema;
        } catch {
          const fresh = this.getBaselineFixtures();
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
          return fresh;
        }
      }
      const fresh = this.getBaselineFixtures();
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
      return fresh;
    }

    if (!this.inMemoryFallback) {
      this.inMemoryFallback = this.getBaselineFixtures();
    }
    return JSON.parse(JSON.stringify(this.inMemoryFallback));
  }

  public setState(updater: (current: AetherStorageSchema) => AetherStorageSchema): AetherStorageSchema {
    const current = this.getState();
    const updated = updater(current);

    if (this.isLocalStorageAvailable()) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } else {
      this.inMemoryFallback = JSON.parse(JSON.stringify(updated));
    }
    return updated;
  }

  public resetToBaselineFixtures(): AetherStorageSchema {
    const baseline = this.getBaselineFixtures();
    if (this.isLocalStorageAvailable()) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(baseline));
    } else {
      this.inMemoryFallback = JSON.parse(JSON.stringify(baseline));
    }
    return baseline;
  }
}

export const aetherStorage = new AetherStorageAdapter();
