export interface NavigationItem {
  name: string;
  icon: string;
  uri: string;
}

export interface NavigationGroup {
  title: string;
  path: string;
  items: NavigationItem[];
}
