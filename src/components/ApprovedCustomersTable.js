import React from "react";

export default function ApprovedCustomersTable({ customers }) {
  return (
    <table className="table-auto w-full border-collapse border border-gray-300 text-sm">
      <thead>
        <tr className="bg-gray-200">
          <th className="border border-gray-300 px-2 py-1">Sjabloon</th>
          <th className="border border-gray-300 px-2 py-1">Naam</th>
          <th className="border border-gray-300 px-2 py-1">Mobiel</th>
        </tr>
      </thead>
      <tbody>
        {customers.map((row, index) => (
          <tr key={index}>
            <td className="border border-gray-300 px-2 py-1 text-center">
                {row.sjabloon ? <span className="text-green-500 text-lg">✔</span> : ""}
            </td>
            <td className="border border-gray-300 px-2 py-1">{row.naam}</td>
            <td className="border border-gray-300 px-2 py-1">{row.mobiel}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}