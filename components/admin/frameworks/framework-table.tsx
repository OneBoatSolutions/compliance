"use client";

import Link from "next/link";

import { Framework } from "@/types/framework";

import { StatusBadge } from "./status-badge";

interface Props {
  frameworks: Framework[];
}

export function FrameworkTable({ frameworks }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-card">
      <table className="w-full" aria-label="Compliance frameworks table">
        <thead className="bg-primary-pale">
          <tr>
            <th scope="col" className="p-4 text-left text-sm font-semibold text-primary-dark">
              Code
            </th>

            <th scope="col" className="p-4 text-left text-sm font-semibold text-primary-dark">
              Name
            </th>

            <th scope="col" className="p-4 text-left text-sm font-semibold text-primary-dark">
              Region
            </th>

            <th scope="col" className="p-4 text-left text-sm font-semibold text-primary-dark">
              Version
            </th>

            <th scope="col" className="p-4 text-left text-sm font-semibold text-primary-dark">
              Controls
            </th>

            <th scope="col" className="p-4 text-left text-sm font-semibold text-primary-dark">
              Status
            </th>
          </tr>
        </thead>

        <tbody>
          {frameworks.map((framework) => (
            <tr key={framework.id} className="border-t border-neutral-100 hover:bg-primary-pale/30">
              <td className="p-4 font-mono text-sm">
                <Link
                  href={`/frameworks/${framework.id}`}
                  className="text-primary hover:text-primary-dark"
                >
                  {framework.code}
                </Link>
              </td>

              <td className="p-4">{framework.name}</td>

              <td className="p-4">{framework.region}</td>

              <td className="p-4">{framework.version}</td>

              <td className="p-4">{framework._count?.controls ?? 0}</td>

              <td className="p-4">
                <StatusBadge status={framework.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
