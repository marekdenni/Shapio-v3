'use client';

// Hook for accessing organization context and permissions
// Facade over useOrgStore — follows the same pattern as useAuth and useSubscription.
import { useOrgStore } from '@/stores/organization';
import type { Organization, OrgMembership, OrgRole } from '@/types';

interface UseOrganizationReturn {
  currentOrg: Organization | null;
  membership: OrgMembership | null;
  userOrgs: Array<{ org: Organization; membership: OrgMembership }>;
  members: OrgMembership[];
  loading: boolean;
  initialized: boolean;

  // Role checks
  myRole: OrgRole | null;
  isOwner: boolean;
  isAdmin: boolean;
  isCoach: boolean;
  isMember: boolean;

  // Permission checks
  canManageMembers: boolean;
  canEditOrg: boolean;
  canViewAnalytics: boolean;

  // Has any org at all
  hasOrgs: boolean;

  // Actions
  loadUserOrgs: (userId: string) => Promise<void>;
  loadOrg: (orgIdOrSlug: string) => Promise<void>;
  loadMembers: (orgId: string) => Promise<void>;
  switchOrg: (orgId: string | null) => void;
}

export function useOrganization(): UseOrganizationReturn {
  const store = useOrgStore();

  return {
    currentOrg: store.currentOrg,
    membership: store.membership,
    userOrgs: store.userOrgs,
    members: store.members,
    loading: store.loading,
    initialized: store.initialized,

    myRole: store.myRole(),
    isOwner: store.isOwner(),
    isAdmin: store.isAdmin(),
    isCoach: store.isCoach(),
    isMember: store.isMember(),

    canManageMembers: store.canManageMembers(),
    canEditOrg: store.canEditOrg(),
    canViewAnalytics: store.canViewAnalytics(),

    hasOrgs: store.userOrgs.length > 0,

    loadUserOrgs: store.loadUserOrgs,
    loadOrg: store.loadOrg,
    loadMembers: store.loadMembers,
    switchOrg: store.switchOrg,
  };
}
