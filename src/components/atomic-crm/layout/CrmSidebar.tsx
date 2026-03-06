import {
  BarChart3,
  Building2,
  FileText,
  FolderKanban,
  Funnel,
  Handshake,
  LayoutDashboard,
  Route,
  Settings,
  Users,
} from "lucide-react";
import { CanAccess, useGetIdentity } from "ra-core";
import { Link, matchPath, useLocation } from "react-router";

import { useConfigurationContext } from "../root/ConfigurationContext";
import { ThemeModeToggle } from "@/components/admin/theme-mode-toggle";

const navItems = [
  { label: "Dashboard", to: "/", icon: LayoutDashboard, match: "/" },
  { label: "Leads", to: "/leads", icon: Funnel, match: "/leads/*" },
  {
    label: "Attribution",
    to: "/attribution",
    icon: Route,
    match: "/attribution/*",
  },
  { label: "Contacts", to: "/contacts", icon: Users, match: "/contacts/*" },
  {
    label: "Companies",
    to: "/companies",
    icon: Building2,
    match: "/companies/*",
  },
  { label: "Deals", to: "/deals", icon: Handshake, match: "/deals/*" },
  {
    label: "Projects",
    to: "/projects",
    icon: FolderKanban,
    match: "/projects/*",
  },
  {
    label: "Invoices",
    to: "/invoices",
    icon: FileText,
    match: "/invoices/*",
  },
  {
    label: "Analytics",
    to: "/project_analytics",
    icon: BarChart3,
    match: "/project_analytics/*",
  },
];

export const CrmSidebar = () => {
  const { darkModeLogo, title } = useConfigurationContext();
  const location = useLocation();
  const { identity } = useGetIdentity();

  return (
    <aside
      className="fixed left-0 top-0 bottom-0 w-[220px] flex flex-col z-40"
      style={{ backgroundColor: "var(--sidebar-bg)" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5">
        <img src={darkModeLogo} alt={title} className="h-6" />
        <span className="text-sm font-semibold text-white">{title}</span>
      </div>

      {/* Nav items */}
      <nav className="flex-1 flex flex-col gap-0.5 px-3 mt-2">
        {navItems.map((item) => {
          const isActive = item.to === "/"
            ? location.pathname === "/"
            : !!matchPath(item.match, location.pathname);
          const Icon = item.icon;

          return (
            <Link
              key={item.to}
              to={item.to}
              className={`
                flex items-center gap-3 px-3 py-2 rounded-md text-[13px] font-medium
                transition-colors relative
                ${
                  isActive
                    ? "text-white"
                    : "text-white/60 hover:text-white/80"
                }
              `}
              style={
                isActive
                  ? { backgroundColor: "var(--sidebar-active-bg)" }
                  : undefined
              }
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor =
                    "var(--sidebar-hover-bg)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = "";
                }
              }}
            >
              {isActive && (
                <div
                  className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r-full"
                  style={{ backgroundColor: "var(--sidebar-active-border)" }}
                />
              )}
              <Icon className="w-[18px] h-[18px] shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="px-3 pb-4 flex flex-col gap-2">
        <CanAccess resource="configuration" action="edit">
          <Link
            to="/settings"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-[13px] font-medium text-white/60 hover:text-white/80 transition-colors"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--sidebar-hover-bg)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "";
            }}
          >
            <Settings className="w-[18px] h-[18px] shrink-0" />
            Settings
          </Link>
        </CanAccess>

        <div className="flex items-center gap-3 px-3 py-2">
          {identity && (
            <Link to="/profile" className="flex items-center gap-3 flex-1 min-w-0">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold text-white shrink-0"
                style={{ backgroundColor: "var(--rc-accent)" }}
              >
                {identity.fullName
                  ? identity.fullName.charAt(0).toUpperCase()
                  : "?"}
              </div>
              <span className="text-xs text-white/60 truncate">
                {identity.fullName || identity.email || "User"}
              </span>
            </Link>
          )}
          <ThemeModeToggle />
        </div>
      </div>
    </aside>
  );
};
