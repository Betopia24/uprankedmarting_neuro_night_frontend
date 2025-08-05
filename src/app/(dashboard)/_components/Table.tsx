const tableData = [
  {
    "Caller Number": "01253647891",
    "Call Type": "Inbound",
    "Call Time": "10:30 PM",
    "Call Duration": "10:30 PM",
    Receive: "10:30 PM",
    "Agent Name": "10:30 PM",
    Date: "10:30 PM",
    "Call Record": "10:30 PM",
    "Call Summary": "10:30 PM",
  },
];

const tableHeader = Object.keys(tableData[0]);

export default function Table() {
  return (
    <div>
      <table className="w-full">
        <thead className="bg-grey-100">
          <tr className="border border-grey-100">
            {tableHeader.map((header) => (
              <th key={header} className="px-4 py-2">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="text-center">
            {tableData.map((row) => {
              return (
                <>
                  {Object.values(row).map((value) => {
                    return (
                      <td
                        key={value}
                        className="px-4 py-2 border border-grey-100"
                      >
                        {value}
                      </td>
                    );
                  })}
                </>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
