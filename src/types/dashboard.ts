export type RoommateId = string;

export type Roommate = {
  id: string;
  name: string;
  opened: number;
  lastActive: string;
  avatar: string;
};

export type DashboardAuthState = {
  currentUserId: RoommateId | '';
  availableUsers: Array<{
    id: RoommateId;
    label: string;
  }>;
};

export type DashboardState = {
  totalRolls: number;
  rollsLeft: number;
  usedTotal: number;
  percentLeft: number;
  estimatedDepletion: string;
  activeUsers: number;
  lastBuyer: string;
  nextBuyer: string;
  auth: DashboardAuthState;
  roommates: Roommate[];
};