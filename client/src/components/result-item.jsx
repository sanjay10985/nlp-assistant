export default function ResultItem({ label, value, score }) {
  return (
    <div className="bg-gray-100 rounded-lg p-4">
      <div className="text-sm font-medium text-gray-500">{label}</div>
      <div className="mt-1 font-semibold text-gray-900 flex items-center">
        {value}
        {score && <span className="ml-2 text-sm font-normal">({score})</span>}
      </div>
    </div>
  );
}
