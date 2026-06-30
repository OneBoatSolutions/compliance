export default function FrameworkTable({
  frameworks,
}: {
  frameworks: { name: string; score: number }[];
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="font-semibold mb-4">Framework Scores</h2>

      <table className="w-full">
        <tbody>
          {frameworks.map((f, i) => (
            <tr key={i}>
              <td>{f.name}</td>
              <td>{f.score}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
