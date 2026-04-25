export default function HeaderCard() {
  return (
    <div className="bg-purple-100 border border-purple-200 rounded-xl p-5">
      <div className="flex justify-between items-start">

        <div>
          <div className="flex gap-2 mb-2">
            <span className="text-xs bg-purple-200 px-2 py-1 rounded">
              HIPAA-164.312(a)(1)
            </span>
            <span className="text-xs bg-orange-200 px-2 py-1 rounded">
              HIGH SEVERITY
            </span>
          </div>

          <h2 className="text-lg font-semibold">Access Control</h2>

          <p className="text-sm text-gray-600 mt-1">
            Implement policies and procedures to allow access only to authorized users.
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
            NOT COMPLIANT
          </span>

          <p className="text-xs text-purple-700 mt-2">
            Improves score by +4%
          </p>
        </div>

      </div>
    </div>
  )
}
