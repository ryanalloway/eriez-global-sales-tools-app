export const tools = [
  { path: "/", title: "Home", id: "home" },
  { path: "/gauss-force", title: "Gauss & Force Plotter", id: "manual" },
  { path: "/magnet-profiles", title: "Magnet Profiles", id: "profiles" },
  { path: "/contour-plots", title: "Contour Plots", id: "contours" },
  { path: "/help", title: "Help & FAQs", id: "help" },
] as const;
export const descriptions: Record<string, string> = {
  home:     "Choose a tool to analyze and compare magnetic performance.",
  manual:   "Enter measured Gauss readings to view field strength, force index, and estimated lift.",
  profiles: "Select magnet models to compare field strength, force index, and static lift estimates.",
  contours: "Compare magnetic-field coverage and static lift thresholds beneath selected magnets.",
  help:     "Answers to common questions about measurements, units, and estimated performance.",
};