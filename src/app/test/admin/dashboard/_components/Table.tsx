import { getData } from "@/lib/data";
import { SortableHeader } from "./SortableHeader";

export async function DataTable({ searchParams }) {
  const { data, headers } = await getData(searchParams);

  return (
    <div className="border rounded text-sm">
      <div className="overflow-x-auto">
        <table className="w-full hidden md:table">
          <thead className="bg-gray-100">
            <tr>
              {headers.map((h) => (
                <SortableHeader key={h} h={h} />
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {data.length ? (
              data.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  {headers.map((h) => (
                    <td key={h} className="px-4 py-2 whitespace-nowrap">
                      {row[h]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={headers.length}
                  className="text-center py-6 text-gray-500"
                >
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 gap-4 md:hidden">
        {data.map((row, i) => (
          <div key={i} className="bg-white p-4 rounded-lg shadow">
            {headers.map((h) => (
              <div key={h} className="flex justify-between">
                <span className="font-bold">{h}</span>
                <span>{row[h]}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}