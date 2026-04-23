'use client';

// Zustand store for organization context
// Manages current org, membership, members list, and role-based permission checks.
// Separate from auth store — loaded when user enters org context.
import { create } from 'zustand';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type {
  Organization,
  OrgMembership,
  OrgRole,
  OrgType,
  OrgPlan,
  MembershipStatus,
} from '@/types';

const supabase = createClientComponentClient();

// ─── Helpers ────────────────────────────────────────────────────────────────

function mapOrg(row: any): Organization {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    type: row.type || 'other',
    logoUrl: row.logo_url || undefined,
    plan: row.plan || 'free',
    settings: row.settings || {},
    stripeCustomerId: row.stripe_customer_id || undefined,
    stripeSubscriptionId: row.stripe_subscription_id || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapMembership(row: any): OrgMembership {
  return {
    id: row.id,
    orgId: row.org_id,
    userId: row.user_id,
    role: row.role,
    status: row.status,
    invitedEmail: row.invited_email || undefined,
    invitedAt: row.invited_at || undefined,
    joinedAt: row.joined_at || undefined,
    createdAt: row.created_at,
  };
}

// ─── Role hierarchy helpers ─────────────────────────────────────────────────

const ROLE_LEVELS: Record<OrgRole, number> = {
  owner: 4,
  admin: 3,
  coach: 2,
  member: 1,
};

function hasRoleLevel(current: OrgRole | null, required: OrgRole): boolean {
  if (!current) return false;
  return ROLE_LEVELS[current] >= ROLE_LEVELS[required];
}

// ─── Store ──────────────────────────────────────────────────────────────────

interface OrgState {
  currentOrg: Organization | null;
  membership: OrgMembership | null;
  userOrgs: Array<{ org: Organization; membership: OrgMembership }>;
  members: OrgMembership[];
  loading: boolean;
  initialized: boolean;

  // Actions
  loadUserOrgs: (userId: string) => Promise<void>;
  loadOrg: (orgIdOrSlug: string) => Promise<void>;
  loadMembers: (orgId: string) => Promise<void>;
  switchOrg: (orgId: string | null) => void;
  clearOrg: () => void;

  // Role / permission helpers (computed from membership)
  myRole: () => OrgRole | null;
  isOwner: () => boolean;
  isAdmin: () => boolean;
  isCoach: () => boolean;
  isMember: () => boolean;
  canManageMembers: () => boolean;
  canEditOrg: () => boolean;
  canViewAnalytics: () => boolean;
}

export const useOrgStore = create<OrgState>()((set, get) => ({
  currentOrg: null,
  membership: null,
  userOrgs: [],
  members: [],
  loading: false,
  initialized: false,

  // Load all orgs the user belongs to
  loadUserOrgs: async (userId: string) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('org_memberships')
        .select(`
          *,
          organizations (*)
        `)
        .eq('user_id', userId)
        .eq('status', 'active');

      if (error) {
        console.error('[org] loadUserOrgs error:', error);
        return;
      }

      const userOrgs = (data || [])
        .filter((row: any) => row.organizations) // guard against orphaned memberships
        .map((row: any) => ({
          org: mapOrg(row.organizations),
          membership: mapMembership(row),
        }));

      set({ userOrgs, initialized: true });
    } catch (err) {
      console.error('[org] loadUserOrgs unexpected error:', err);
    } finally {
      set({ loading: false });
    }
  },

  // Load a specific org by ID or slug
  loadOrg: async (orgIdOrSlug: string) => {
    set({ loading: true });
    try {
      // Try by slug first (for URL routing), fall back to ID
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(orgIdOrSlug);
      const column = isUuid ? 'id' : 'slug';

      const { data: orgRow, error: orgError } = await supabase
        .from('organizations')
        .select('*')
        .eq(column, orgIdOrSlug)
        .single();

      if (orgError || !orgRow) {
        console.error('[org] loadOrg error:', orgError);
        set({ currentOrg: null, membership: null });
        return;
      }

      const org = mapOrg(orgRow);

      // Load the current user's membership in this org
      const { data: { user } } = await supabase.auth.getUser();
      let membership: OrgMembership | null = null;

      if (user) {
        const { data: memberRow } = await supabase
          .from('org_memberships')
          .select('*')
          .eq('org_id', org.id)
          .eq('user_id', user.id)
          .eq('status', 'active')
          .single();

        if (memberRow) {
          membership = mapMembership(memberRow);
        }
      }

      set({ currentOrg: org, membership });
    } catch (err) {
      console.error('[org] loadOrg unexpected error:', err);
    } finally {
      set({ loading: false });
    }
  },

  // Load all members of the current org (for admin/coach views)
  loadMembers: async (orgId: string) => {
    try {
      const { data, error } = await supabase
        .from('org_memberships')
        .select('*')
        .eq('org_id', orgId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('[org] loadMembers error:', error);
        return;
      }

      set({ members: (data || []).map(mapMembership) });
    } catch (err) {
      console.error('[org] loadMembers unexpected error:', err);
    }
  },

  // Switch active org context
  switchOrg: (orgId: string | null) => {
    if (!orgId) {
      set({ currentOrg: null, membership: null, members: [] });
      return;
    }

    // If we already have this org in userOrgs, set it from cache
    const found = get().userOrgs.find((o) => o.org.id === orgId);
    if (found) {
      set({ currentOrg: found.org, membership: found.membership });
    }
    // Also trigger a fresh load to get latest data
    get().loadOrg(orgId);
  },

  clearOrg: () => {
    set({
      currentOrg: null,
      membership: null,
      members: [],
    });
  },

  // ─── Role helpers ─────────────────────────────────────────────────────
  myRole: () => get().membership?.role ?? null,
  isOwner: () => get().membership?.role === 'owner',
  isAdmin: () => hasRoleLevel(get().membership?.role ?? null, 'admin'),
  isCoach: () => hasRoleLevel(get().membership?.role ?? null, 'coach'),
  isMember: () => !!get().membership,

  canManageMembers: () => hasRoleLevel(get().membership?.role ?? null, 'admin'),
  canEditOrg: () => hasRoleLevel(get().membership?.role ?? null, 'admin'),
  canViewAnalytics: () => hasRoleLevel(get().membership?.role ?? null, 'coach'),
}));
