export default function RemediationActions() {
  const steps = [
    {
      title: "Implement RBAC",
      priority: "HIGH",
      tasks: [
        "Define roles",
        "Map users",
        "Audit access",
      ],
    },
    {
      title: "Enable MFA",
      priority: "HIGH",
      tasks: ["Setup MFA", "Test flows"],
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Priority Actions</h3>

      {steps.map((step, i) => (
        <div
          key={i}
          className="border rounded-xl p-4 space-y-2"
        >
          <div className="flex justify-between">
            <p className="font-medium">{step.title}</p>
            <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
              {step.priority}
            </span>
          </div>

          <ul className="text-sm text-muted-foreground space-y-1">
            {step.tasks.map((t, j) => (
              <li key={j}>• {t}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
