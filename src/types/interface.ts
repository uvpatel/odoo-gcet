export interface NavLink {
  label: string;
  ariaLabel: string;
  
}

export interface NavItem {
  label: string;
  bgColor: string;
  textColor: string;
  links: NavLink[];
}
