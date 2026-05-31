export default function RecommendedTools() {
  const tools = ["Auth0", "Okta Identity", "Azure AD"];

  return (
    <div className="bg-white border rounded-xl p-4 space-y-3">
      <h4 className="text-sm font-medium">Recommended Tools</h4>

      {tools.map((tool, i) => (
        <div key={i} className="flex justify-between text-sm">
          <span>{tool}</span>
          <button className="text-purple-600 text-xs">Learn More</button>
        </div>
      ))}
    </div>
  );
}
