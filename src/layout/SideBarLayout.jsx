import { useState } from "react";
import { useDispatch } from "react-redux";
import { useGetJokeOfTheDayQuery } from "../redux/Api/jokeApi";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  LayoutDashboard,
  Settings,
  ChevronRight,
  LogOut,
  Flag,
  Server,
  ChartLine,
  Mail,
  Users,
  Shield,
  House,
  Sparkles,
  Bell,
  Menu,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Logo from "@/assets/dtagent.png";
import { AskAgentDrawer } from "../models/AskAgentDrawer";
import { logout } from "../redux/apiSlice/authSlice";
// ── NEW: import context ──────────────────────────────────────────
import {
  DigestFilterProvider,
  useDigestFilter,
} from "../pages/memeber/Digestfiltercontext";

// ─── Nav Configs ──────────────────────────────────────────────────────────────

const admindashbaordNav = [
  {
    label: "Overview",
    items: [
      {
        key: "dashboard",
        label: "Pilot dashboard",
        icon: <LayoutDashboard />,
      },
    ],
  },
  {
    label: "Content",
    items: [
      {
        key: "moderationqueue",
        label: "Moderation queue",
        icon: <Flag />,
      },
      { key: "sources", label: "Sources", icon: <Server /> },
    ],
  },
  {
    label: "Insights",
    items: [
      {
        key: "analytics",
        label: "Analytics",
        badge: null,
        icon: <ChartLine />,
      },
      {
        key: "alertsystem",
        label: "Alert system",
        badge: null,
        icon: <Mail />,
      },
    ],
  },
  {
    label: "System",
    items: [
      { key: "members", label: "Members", icon: <Users /> },
      { key: "auditlog", label: "Audit log", icon: <Shield /> },
      { key: "settings", label: "Settings", icon: <Settings /> },
    ],
  },
];

const memberdashbaordNav = [
  {
    label: "Today",
    items: [
      {
        key: "dailydigest",
        label: "Daily Digest",
        icon: <House />,
      },
      {
        key: "askagent",
        label: "Ask Agent",
        icon: <Sparkles />,
      },
    ],
  },
  {
    label: "Categories",
    items: [
      {
        key: "moderationqueue",
        label: "Moderation queue",
        icon: <Flag />,
      },
      { key: "sources", label: "Sources", icon: <Server /> },
    ],
  },
  {
    label: "Account",
    items: [
      { key: "alertpreferences", label: "Alert Preferences", icon: <Bell /> },
      { key: "membersettings", label: "Settings", icon: <Settings /> },
    ],
  },
];

// ─── Role Config Map ──────────────────────────────────────────────────────────

const ROLE_CONFIG = {
  admin: {
    nav: admindashbaordNav,
    title: "Admin Console",
    prefix: "/admin",
    initials: "AD",
    name: "Admin",
    subtitle: "System Admin",
    avatarColor: "#E76F51",
  },
  member: {
    nav: memberdashbaordNav,
    title: "Member Panel",
    prefix: "/member",
    initials: "MB",
    name: "Member",
    subtitle: "DTA Member",
    avatarColor: "#2A9D8F",
  },
};

// ── NEW: Category data for inline sidebar filter ──────────────────
const SIDEBAR_CATEGORIES = [
  { key: "technology", label: "Technology", dot: "bg-blue-600" },
  { key: "hygiene", label: "Hygiene", dot: null },
  { key: "products", label: "Products", dot: "bg-orange-500" },
  { key: "regulation", label: "Regulations", dot: null },
  { key: "clinical", label: "Clinical", dot: "bg-red-500" },
  { key: "business", label: "Business", dot: null },
  { key: "mainstream", label: "Mainstream", dot: "bg-gray-600" },
];

// ── NEW: Inline category filter rendered inside the sidebar ───────
const SidebarCategoryFilter = () => {
  const { activeFilters, setActiveFilters } = useDigestFilter();
  const navigate = useNavigate();
  const location = useLocation();
  const [jokeRevealed, setJokeRevealed] = useState(false);
  const {
    data: jokeData,
    isLoading: jokeLoading,
    refetch,
  } = useGetJokeOfTheDayQuery();

  const joke = jokeData?.data?.joke || "";
  const answer = jokeData?.data?.answer || "";

  const handleNextJoke = () => {
    setJokeRevealed(false);
    refetch();
  };

  const handleCategoryClick = (key) => {
    setActiveFilters((prev) => {
      if (prev.includes(key)) {
        return [];
      }
      return [key];
    });

    if (!location.pathname.startsWith("/member/dailydigest")) {
      navigate("/member/dailydigest");
    }
  };

  return (
    <div>
      {/* Joke of the day */}
      <div className="mx-3 mb-2 bg-cyan-50 border border-cyan-200 rounded-xl p-3">
        <p className="text-[10px] font-bold tracking-widest text-cyan-600 uppercase mb-1.5 flex items-center gap-1">
          😄 Joke of the day
        </p>
        {jokeLoading ? (
          <p className="text-[12px] text-gray-400 animate-pulse">Loading...</p>
        ) : joke ? (
          <>
            <p className="text-[12px] text-gray-700 leading-snug mb-2.5">
              {joke}
            </p>
            {jokeRevealed && (
              <p className="text-[11px] text-cyan-700 font-semibold mb-2 italic">
                {answer}
              </p>
            )}
            <div className="flex gap-1.5 flex-wrap">
              {!jokeRevealed && (
                <button
                  onClick={() => setJokeRevealed(true)}
                  className="text-[11px] px-2.5 py-1 border border-cyan-300 text-cyan-700 hover:bg-cyan-100 bg-white rounded-md transition-colors"
                >
                  Reveal
                </button>
              )}
              <button
                onClick={handleNextJoke}
                className="text-[11px] px-2.5 py-1 border border-cyan-300 text-cyan-700 hover:bg-cyan-100 bg-white rounded-md flex items-center gap-1 transition-colors"
              >
                <Sparkles size={9} /> Next Joke
              </button>
            </div>
          </>
        ) : (
          <p className="text-[12px] text-gray-400">No joke today.</p>
        )}
      </div>

      {/* Category rows */}
      <div className="flex flex-col gap-0.5">
        {SIDEBAR_CATEGORIES.map((cat) => {
          const isActive = activeFilters.includes(cat.key);
          return (
            <button
              key={cat.key}
              onClick={() => handleCategoryClick(cat.key)}
              className={`flex items-center gap-2.5 px-[18px] py-[8px] w-full text-left transition-all border-l-[3px]
                ${
                  isActive
                    ? "border-l-[#0f2d5c] bg-blue-50/80"
                    : "border-l-transparent hover:bg-accent"
                }`}
            >
              {cat.dot ? (
                <span
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${cat.dot}`}
                />
              ) : (
                <span className="w-2 h-2 flex-shrink-0" />
              )}
              <span
                className={`flex-1 text-[13px] font-medium
                ${isActive ? "text-[#0f2d5c] font-semibold" : "text-foreground"}`}
              >
                {cat.label}
              </span>
              <span
                className={`text-[11px] min-w-[20px] text-center rounded-full
                ${
                  isActive
                    ? "bg-[#0f2d5c] text-white px-1.5 py-0.5 text-[10px] font-bold"
                    : "text-muted-foreground"
                }`}
              >
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function SidebarLayout({ role = "admin" }) {
  const [openMenus, setOpenMenus] = useState({});
  const [mobileOpen, setMobileOpen] = useState(false);
  const [AskAgentOpen, setAskAgentOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();


  const config = ROLE_CONFIG[role] ?? ROLE_CONFIG.admin;
  const { nav, prefix, avatarColor, name, subtitle } = config;

  const activePage = location.pathname.split("/").pop() || "";

  const hideAskAgentButton =
    location.pathname === "/member/askagent" ||
    location.pathname.startsWith("/admin");

  const activeSection = nav.find((section) =>
    section.items.some(
      (item) =>
        item.key === activePage ||
        item.children?.some((child) => child.key === activePage),
    ),
  );

  const activeItem = activeSection?.items.find(
    (item) =>
      item.key === activePage ||
      item.children?.some((child) => child.key === activePage),
  );

  const activeChild = activeItem?.children?.find(
    (child) => child.key === activePage,
  );
  const pageTitle = activeChild?.label || activeItem?.label || "";

  const toggleMenu = (key) =>
    setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));

  const isChildActive = (children = []) =>
    children.some((c) => c.key === activePage);

  const SidebarNav = () => (
    <>
      <SidebarHeader className="px-5 py-[22px] pb-4 border-b border-border gap-0">
        <div className="flex gap-3 mb-5">
          <img src={Logo} alt="Logo" className="w-10 h-10" />
          <div>
            <h1 className="font-semibold">DTAgent</h1>
            <p className="text-[11px] text-muted-foreground">{config.title}</p>
          </div>
        </div>
        <div className="text-[11px] text-muted-foreground mt-0.5">
          STAFF · DTA
        </div>
      </SidebarHeader>

      <SidebarContent>
        {nav.map(({ label, items }) => (
          <SidebarGroup key={label} className="py-0 px-0">
            <SidebarGroupLabel className="px-[18px] pt-4 pb-1.5 text-[10px] font-bold uppercase tracking-[0.9px] h-auto">
              {label}
            </SidebarGroupLabel>

            <SidebarGroupContent>
              {/* ── NEW: Replace Categories content with inline filter for member ── */}
              {role === "member" && label === "Categories" ? (
                <SidebarCategoryFilter />
              ) : (
                <SidebarMenu>
                  {items.map(
                    ({
                      key,
                      label: itemLabel,
                      icon,
                      badge,
                      children: subItems,
                    }) => {
                      // ── Item with nested children ──
                      if (subItems?.length) {
                        const childActive = isChildActive(subItems);
                        const isOpen = openMenus[key] ?? childActive;

                        return (
                          <Collapsible
                            key={key}
                            open={isOpen}
                            onOpenChange={() => toggleMenu(key)}
                          >
                            <SidebarMenuItem>
                              <CollapsibleTrigger asChild>
                                <SidebarMenuButton
                                  className={`rounded-none border-l-[3px] px-[18px] py-[9px] h-auto text-[13px] font-medium gap-2.5 ${
                                    childActive
                                      ? "border-l-[#163d72] bg-[#163d72] text-[#163d72] font-semibold"
                                      : "border-l-transparent"
                                  }`}
                                >
                                  {icon}
                                  <span className="flex-1">{itemLabel}</span>
                                  {badge && (
                                    <SidebarMenuBadge className="bg-[#163d72] text-white text-[11px] font-bold rounded-[10px] px-[7px]">
                                      {badge}
                                    </SidebarMenuBadge>
                                  )}
                                  <ChevronRight
                                    className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${
                                      isOpen ? "rotate-90" : ""
                                    }`}
                                  />
                                </SidebarMenuButton>
                              </CollapsibleTrigger>

                              <CollapsibleContent>
                                <SidebarMenuSub className="ml-0 pl-0 border-l-0">
                                  {subItems.map(
                                    ({
                                      key: childKey,
                                      label: childLabel,
                                      icon: childIcon,
                                      badge: childBadge,
                                    }) => (
                                      <SidebarMenuSubItem key={childKey}>
                                        <SidebarMenuSubButton
                                          isActive={activePage === childKey}
                                          onClick={() =>
                                            navigate(`${prefix}/${childKey}`)
                                          }
                                          className={`rounded-none border-l-[3px] pl-[36px] pr-[18px] py-[8px] h-auto text-[12.5px] font-medium gap-2 ${
                                            activePage === childKey
                                              ? "border-l-[#163d72] bg-[#163d72] text-[#163d72] cursor-pointer font-semibold"
                                              : "border-l-transparent"
                                          }`}
                                        >
                                          {childIcon}
                                          <span className="flex-1">
                                            {childLabel}
                                          </span>
                                          {childBadge && (
                                            <SidebarMenuBadge className="bg-[#163d72] text-white text-[11px] font-bold rounded-[10px] px-[7px]">
                                              {childBadge}
                                            </SidebarMenuBadge>
                                          )}
                                        </SidebarMenuSubButton>
                                      </SidebarMenuSubItem>
                                    ),
                                  )}
                                </SidebarMenuSub>
                              </CollapsibleContent>
                            </SidebarMenuItem>
                          </Collapsible>
                        );
                      }

                      // ── Regular item ──
                      return (
                        <SidebarMenuItem key={key}>
                          <SidebarMenuButton
                            isActive={activePage === key}
                            onClick={() => {
                              navigate(`${prefix}/${key}`);
                              setMobileOpen(false);
                            }}
                            className={`rounded-none border-l-[4px] px-[18px] py-[9px] h-auto text-[13px] font-medium gap-2.5 ${
                              activePage === key
                                ? "border-l-[#163d72] bg-[#163d72] text-[#163d72] font-semibold cursor-pointer"
                                : "border-l-transparent cursor-pointer"
                            }`}
                          >
                            {icon}
                            <span>{itemLabel}</span>
                            {badge && (
                              <SidebarMenuBadge className="bg-[#163d72] text-white text-[11px] font-bold rounded-[10px] px-[7px]">
                                {badge}
                              </SidebarMenuBadge>
                            )}
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    },
                  )}
                </SidebarMenu>
              )}
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="px-[18px] py-3.5 border-t border-border">
        <div className="flex items-center gap-[9px]">
          <Avatar className="w-8 h-8 flex-shrink-0">
            <AvatarImage />
            <AvatarFallback
              style={{ backgroundColor: avatarColor }}
              className="text-white text-[12px] font-bold"
            >
              A
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="text-[12.5px] font-semibold text-foreground">
              {name}
            </div>
            <div className="text-[11px] text-muted-foreground">{subtitle}</div>
          </div>
        </div>
      </SidebarFooter>
    </>
  );

  // ── NEW: Wrapped with DigestFilterProvider so sidebar + pages share filter state ──
  return (
    <DigestFilterProvider>
      <SidebarProvider>
        <div className="flex h-screen w-full overflow-hidden">
          {/* Desktop Sidebar */}
          <Sidebar
            collapsible="none"
            className="hidden lg:flex border-r border-border w-[220px] flex-shrink-0"
          >
            <SidebarNav />
          </Sidebar>

          {/* ── Main Area ── */}
          <div className="flex flex-col flex-1 h-screen overflow-hidden">
            <header className="h-14 bg-background border-b border-border flex justify-between items-center px-6 gap-3">
              {/* Mobile Menu Button */}
              <div className="flex items-center gap-3">
                <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="lg:hidden">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="p-0 w-[220px]">
                    <SidebarNav />
                  </SheetContent>
                </Sheet>

                <div>
                  {activeSection && (
                    <>
                      <p className="text-xs text-muted-foreground">
                        DTAgent / {activeSection.label}
                      </p>
                      <h1 className="text-base font-semibold">{pageTitle}</h1>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 cursor-pointer">
                  <Avatar className="w-[34px] h-[34px]">
                    <AvatarImage />
                    <AvatarFallback
                      style={{ backgroundColor: avatarColor }}
                      className="text-white text-[12px] font-bold"
                    >
                      A
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-[13px] font-semibold text-foreground">
                      {name}
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      {subtitle}
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    dispatch(logout());
                    localStorage.removeItem("auth_data");
                    navigate("/login", { replace: true });
                  }}
                  title="Sign out"
                  className="w-9 h-9 rounded-[9px] hover:bg-[#FEF2F2] hover:border-[#FECACA] hover:text-[#e63946] cursor-pointer "
                >
                  <LogOut />
                </Button>
              </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-gray-100 p-4">
              {!hideAskAgentButton && (
                <Button
                  onClick={() => setAskAgentOpen(true)}
                  className="py-5 px-5 rounded-full hover:bg-[#163d72] absolute bottom-20 right-20 cursor-pointer"
                >
                  <Sparkles size={13} />
                  Ask agent
                </Button>
              )}
              <Outlet />
            </main>
          </div>

          <AskAgentDrawer Open={AskAgentOpen} onClose={setAskAgentOpen} />
        </div>
      </SidebarProvider>
    </DigestFilterProvider>
  );
}
