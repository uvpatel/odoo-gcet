"use client";
import CardNav from '@/components/CardNav'

import type { CardNavItem } from "@/types/navigation";


export const Navbar = () => {
  const navitems: CardNavItem[] = [
    {
      label: "About",
      bgColor: "#0D0716",
      textColor: "#fff",
      links: [
        {
          label: "Company",
          ariaLabel: "About Company",
          href: "/about/company"
        },
        {
          label: "Careers",
          ariaLabel: "About Careers",
          href: "/about/careers"
        }
      ]
    },
    {
      label: "Fetures",
      bgColor: "#0D0716",
      textColor: "#fff",
      links: [
        {
          label: "Company",
          ariaLabel: "About Company",
          href: "/about/company"
        },
        {
          label: "Careers",
          ariaLabel: "About Careers",
          href: "/about/careers"
        }
      ]
    },
    {
      label: "Projects",
      bgColor: "#170D27",
      textColor: "#fff",
      links: [
        {
          label: "Featured",
          ariaLabel: "Featured Projects",
          href: "/projects/featured"
        },
        {
          label: "Case Studies",
          ariaLabel: "Project Case Studies",
          href: "/projects/case-studies"
        },

      ]
    }
  ];

  return (
    <CardNav
      logo="/logo.svg"
      logoAlt="Company Logo"
      items={navitems}
      baseColor="#fff"
      menuColor="#000"
      buttonBgColor="#111"
      buttonTextColor="#fff"
      ease="power3.out"
    />
  );
};