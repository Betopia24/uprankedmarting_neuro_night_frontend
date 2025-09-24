import React from "react";
import { env } from "@/env";
import { getAccessToken, getServerAuth } from "@/lib/auth";
import { formatDateTime } from "@/utils/formatDateTime";

interface SubscriptionResponse {
  success: boolean;
  message: string;
  data: Subscription;
}

interface Subscription {
  id: string;
  organizationId: string;
  planId: string;
  startDate: string;
  endDate: string;
  amount: number;
  stripePaymentId: string;
  paymentStatus: string;
  status: string;
  planLevel: string;
  purchasedNumber: string;
  sid: string;
  numberOfAgents: number;
  createdAt: string;
  updatedAt: string;
  organization: {
    id: string;
    name: string;
    organizationNumber: string;
    industry: string;
    address: string;
    websiteLink: string;
  };
  plan: {
    id: string;
    planName: string;
    amount: number;
    currency: string;
    interval: string;
    intervalCount: number;
    description: string;
    planLevel: string;
  };
}

async function getSubscription(): Promise<SubscriptionResponse | null> {
  const accessToken = await getAccessToken();

  const url = new URL(`${env.API_BASE_URL}/subscriptions/my-subscription`);
  const res = await fetch(url.toString(), {
    headers: { Authorization: accessToken as string },
  });

  if (!res.ok) return null;
  return res.json();
}

export default async function SubscriptionPage() {
  const response = await getSubscription();

  if (!response || !response.data) {
    return (
      <div className="py-16 text-center text-gray-500 bg-white shadow-sm rounded-lg">
        Failed to load subscription data.
      </div>
    );
  }

  const sub = response.data;

  const tableData = [
    {
      id: sub.id,
      planName: sub.plan.planName,
      amount: `${sub.amount} ${sub.plan.currency.toUpperCase()}`,
      interval: `${sub.plan.intervalCount} ${sub.plan.interval}`,
      paymentStatus:
        sub.paymentStatus.charAt(0).toUpperCase() + sub.paymentStatus.slice(1),
      status: sub.status.charAt(0).toUpperCase() + sub.status.slice(1),
      purchasedNumber: sub.purchasedNumber,
      numberOfAgents: sub.numberOfAgents,
      startDate: formatDateTime(sub.startDate),
      endDate: formatDateTime(sub.endDate),
    },
  ];

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8">
      <h1 className="text-xl font-semibold text-gray-800">My Subscription</h1>

      <div className="w-full overflow-x-auto bg-white shadow rounded-lg border border-gray-200">
        <table className="min-w-full text-sm text-left text-gray-700 border-collapse">
          <thead className="bg-gray-50 text-gray-900 text-sm font-medium border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 border border-gray-200">Plan</th>
              <th className="px-4 py-3 border border-gray-200">Amount</th>
              <th className="px-4 py-3 border border-gray-200">Interval</th>
              <th className="px-4 py-3 border border-gray-200">
                Payment Status
              </th>
              <th className="px-4 py-3 border border-gray-200">Status</th>
              <th className="px-4 py-3 border border-gray-200">Number</th>
              <th className="px-4 py-3 border border-gray-200">Agents</th>
              <th className="px-4 py-3 border border-gray-200">Start Date</th>
              <th className="px-4 py-3 border border-gray-200">End Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {tableData.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <td className="px-4 py-3 border border-gray-200 whitespace-nowrap">
                  {item.planName}
                </td>
                <td className="px-4 py-3 border border-gray-200 whitespace-nowrap">
                  {item.amount}
                </td>
                <td className="px-4 py-3 border border-gray-200 whitespace-nowrap">
                  {item.interval}
                </td>
                <td className="px-4 py-3 border border-gray-200 whitespace-nowrap">
                  {item.paymentStatus}
                </td>
                <td className="px-4 py-3 border border-gray-200 whitespace-nowrap">
                  {item.status}
                </td>
                <td className="px-4 py-3 border border-gray-200 whitespace-nowrap">
                  {item.purchasedNumber}
                </td>
                <td className="px-4 py-3 border border-gray-200 whitespace-nowrap">
                  {item.numberOfAgents}
                </td>
                <td className="px-4 py-3 border border-gray-200 whitespace-nowrap">
                  {item.startDate}
                </td>
                <td className="px-4 py-3 border border-gray-200 whitespace-nowrap">
                  {item.endDate}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
