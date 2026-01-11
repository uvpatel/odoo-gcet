export interface CardNavLink {
  label: string;
  ariaLabel: string;
  href: string;
}

export interface CardNavItem {
  label: string;
  bgColor: string;
  textColor: string;
  links: CardNavLink[];
}
