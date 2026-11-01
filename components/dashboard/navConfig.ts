import {
  Award,
  Bell,
  Bot,
  BookMarked,
  BookOpen,
  CalendarDays,
  CheckSquare,
  ClipboardList,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Megaphone,
  MessageSquare,
  School,
  ScrollText,
  Settings,
  Sparkles,
  Trophy,
  Users,
  Wallet,
  Youtube,
  type LucideIcon,
} from 'lucide-react';

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
};

export type NavGroup = { label: string; items: NavItem[] };

/** Single source of truth for the learner menu (desktop sidebar + mobile menu sheet). */
export const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Home',
    items: [
      { href: '/dashboard', label: 'Today', icon: LayoutDashboard, exact: true },
      { href: '/dashboard/announcements', label: 'Announcements', icon: Megaphone },
    ],
  },
  {
    label: 'Learn',
    items: [
      { href: '/dashboard/my-learning', label: 'My Learning', icon: Sparkles },
      { href: '/dashboard/courses', label: 'My Courses', icon: BookOpen },
      { href: '/dashboard/library', label: 'Library', icon: BookMarked },
      { href: '/dashboard/library/learn', label: 'Book tutor', icon: ScrollText },
      { href: '/dashboard/classroom', label: 'Classroom', icon: School },
    ],
  },
  {
    label: 'Academic',
    items: [
      { href: '/dashboard/academic', label: 'Overview', icon: GraduationCap },
      { href: '/dashboard/calendar', label: 'Calendar', icon: CalendarDays },
      { href: '/dashboard/assignments', label: 'Assignments', icon: ClipboardList },
      { href: '/dashboard/todos', label: 'Tasks', icon: CheckSquare },
      { href: '/dashboard/fees', label: 'School fees', icon: Wallet },
    ],
  },
  {
    label: 'Community',
    items: [
      { href: '/dashboard/messages', label: 'Messages', icon: MessageSquare },
      { href: '/dashboard/community', label: 'Community', icon: Users },
      { href: '/dashboard/study-groups', label: 'Groups', icon: Users },
      { href: '/dashboard/mentorship', label: 'Mentorship', icon: Users },
      { href: '/dashboard/notes', label: 'Notes', icon: FileText },
    ],
  },
  {
    label: 'Career',
    items: [
      { href: '/dashboard/portfolio', label: 'Portfolio', icon: Award },
      { href: '/dashboard/opportunities', label: 'Opportunities', icon: Sparkles },
      { href: '/dashboard/achievements', label: 'Progress', icon: Trophy },
    ],
  },
  {
    label: 'Personal',
    items: [
      { href: '/dashboard/tutor', label: 'AI Tutor', icon: Bot },
      { href: '/dashboard/videos', label: 'Video Hall', icon: Youtube },
      { href: '/dashboard/notifications', label: 'Notifications', icon: Bell },
      { href: '/dashboard/subscription', label: 'Subscription', icon: Award },
      { href: '/dashboard/settings', label: 'Settings', icon: Settings },
    ],
  },
];
