"use client";

import React, { useEffect, useState } from "react";
import { fetchPartnerReferrals, ReferralUser } from "@/services/referrals";

export default function ReferralsPage() {
  const [referrals, setReferrals] = useState<ReferralUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadReferrals = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchPartnerReferrals();
        setReferrals(data);
      } catch (err: any) {
        setError(err.message || "Не удалось загрузить список рефералов");
      } finally {
        setIsLoading(false);
      }
    };

    loadReferrals();
  }, []);

  // Utility to format numbers into Russian Ruble currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Utility to translate backend statuses to readable Russian text
  const translateStatus = (status: string) => {
    const statuses: Record<string, string> = {
      APPROVED: "Одобрен",
      PENDING: "На модерации",
      REJECTED: "Отклонен",
      BANNED: "Заблокирован",
    };
    return statuses[status] || status;
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="p-4 text-red-700 bg-red-50 border border-red-200 rounded-lg">
          <p className="font-medium">Ошибка загрузки</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Мои рефералы</h1>
        <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium">
          Всего рефералов: {referrals.length}
        </div>
      </div>

      {referrals.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
          <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            У вас пока нет рефералов
          </h3>
          <p className="text-gray-500">
            Поделитесь своей партнерской ссылкой, чтобы начать зарабатывать.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Исполнитель
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Регистрация
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Статус
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Тариф
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Комиссия
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {referrals.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* Performer Details */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-900">
                          {user.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {user.companyName}
                        </span>
                      </div>
                    </td>

                    {/* Registration Date */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(user.registrationDate).toLocaleDateString(
                        "ru-RU",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        },
                      )}
                    </td>

                    {/* Moderation Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                          user.status === "APPROVED"
                            ? "bg-green-100 text-green-800"
                            : user.status === "PENDING"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {translateStatus(user.status)}
                      </span>
                    </td>

                    {/* Tariff / Subscription details */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span
                          className={`text-sm font-medium ${user.hasActiveTariff ? "text-blue-600" : "text-gray-900"}`}
                        >
                          {user.tariffName}
                        </span>
                        {user.hasActiveTariff && user.pricePaid > 0 && (
                          <span className="text-xs text-gray-500">
                            Оплачено: {formatCurrency(user.pricePaid)}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Earned Commission */}
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {user.commissionAmount > 0 ? (
                        <span className="text-sm font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                          +{formatCurrency(user.commissionAmount)}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
