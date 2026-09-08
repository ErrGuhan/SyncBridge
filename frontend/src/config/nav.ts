export interface NavItem {
  label: string;
  href: string;
}

export const PUBLIC_NAV_LINKS: NavItem[] = [
  { label: 'Services', href: '/services' },
  { label: 'Track Orders', href: '/bookings' },
  { label: 'Co-op Welfare', href: '/welfare' },
  { label: 'B2B Contracts', href: '/b2b' }
];

export const GET_ROLE_NAV_LINKS = (role?: string | null): NavItem[] => {
  if (role === 'WORKER') {
    return [
      { label: 'Worker Workspace', href: '/portal/worker' },
      { label: 'Services', href: '/services' },
      { label: 'My Bookings', href: '/bookings' },
      { label: 'Co-op Welfare', href: '/welfare' }
    ];
  }
  if (role === 'SOCIETY_SECRETARY' || role === 'COOP_ADMIN') {
    return [
      { label: 'Federation Admin', href: '/portal/admin' },
      { label: 'Operations', href: '/portal/management' },
      { label: 'Services', href: '/services' },
      { label: 'Co-op Welfare', href: '/welfare' }
    ];
  }
  if (role === 'CUSTOMER') {
    return [
      { label: 'Customer Portal', href: '/portal/customer' },
      { label: 'Services', href: '/services' },
      { label: 'My Orders', href: '/bookings' },
      { label: 'Co-op Welfare', href: '/welfare' }
    ];
  }
  return PUBLIC_NAV_LINKS;
};

export const NAV_LINKS = PUBLIC_NAV_LINKS;

export const EMERGENCY_LINK = {
  label: 'Emergency SOS',
  href: '/services?emergency=true'
};
