export const mockRemediationData = {
  tools: [
    {
      name: "Auth0",
      badge: "TOP RATED",
      link: "#",
    },
    {
      name: "Okta Identity",
      badge: "ENTERPRISE READY",
      link: "#",
    },
  ],

  timeline: {
    totalWeeks: 12,
    phases: [
      { label: "RBAC Configuration", weeks: 6 },
      { label: "Testing & Validation", weeks: 4 },
    ],
  },

  cost: {
    items: [
      { label: "SaaS Licenses", value: "$1,200/yr" },
      { label: "Labor (Internal)", value: "$6,400" },
    ],
    total: "$7,600",
  },
};
