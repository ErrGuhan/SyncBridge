export interface NavItem {
  label: string;
  href: string;
}

export const NAV_LINKS: NavItem[] = [
  { label: 'Services', href: '/services' },
  { label: 'My Orders', href: '/bookings' },
  { label: 'Worker Portal', href: '/portal/worker' },
  { label: 'Federation Admin', href: '/portal/admin' },
  { label: 'B2B Contracts', href: '/b2b' },
  { label: 'Welfare Fund', href: '/welfare' }
];

export const EMERGENCY_LINK = {
  label: 'Emergency SOS',
  href: '/services?emergency=true'
};
