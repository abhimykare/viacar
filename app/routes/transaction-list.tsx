import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Filter, ChevronLeft, ChevronRight } from "lucide-react";
import type { Transaction } from "~/lib/types";
import { Button } from "~/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import Header from "~/components/layouts/header";
import ImageSampleMan from "/assets/imagesampleman.png";
import Footer from "~/components/layouts/footer";
import { api } from "~/lib/api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";

// Static data fallback for demo purposes
const staticTransactions: Transaction[] = [
  {
    id: "1",
    user: { id: "u1", name: "Novák Balázs", avatar: "/avatars/avatar-1.png" },
    date: "13 / 05 / 2025",
    from: "Riyadh",
    to: "Jeddah",
    status: "Completed",
    amount: "SAR 1200",
    image: ImageSampleMan,
  },
  {
    id: "2",
    user: { id: "u2", name: "Serenity", avatar: "/avatars/avatar-2.png" },
    date: "13 / 05 / 2025",
    from: "Dammam",
    to: "Riyadh",
    status: "Completed",
    amount: "SAR 1200",
    image: ImageSampleMan,
  },
  {
    id: "3",
    user: { id: "u3", name: "Balogh Imre", avatar: "/avatars/avatar-3.png" },
    date: "13 / 05 / 2025",
    from: "Jeddah",
    to: "Makkah",
    status: "Completed",
    amount: "SAR 1200",
    image: ImageSampleMan,
  },
  {
    id: "4",
    user: { id: "u4", name: "Fekete Csanád", avatar: "/avatars/avatar-4.png" },
    date: "13 / 05 / 2025",
    from: "Abha",
    to: "Jazan",
    status: "Completed",
    amount: "SAR 1200",
    image: ImageSampleMan,
  },
  {
    id: "5",
    user: { id: "u5", name: "Irma", avatar: "/avatars/avatar-5.png" },
    date: "13 / 05 / 2025",
    from: "AlUla",
    to: "Tabuk",
    status: "Completed",
    amount: "SAR 1200",
    image: ImageSampleMan,
  },
  {
    id: "6",
    user: { id: "u6", name: "Somogyi Adrián", avatar: "/avatars/avatar-6.png" },
    date: "13 / 05 / 2025",
    from: "Riyadh",
    to: "Al Qassim",
    status: "Completed",
    amount: "SAR 1200",
    image: ImageSampleMan,
  },
  {
    id: "7",
    user: {
      id: "u7",
      name: "Orosz Boldizsár",
      avatar: "/avatars/avatar-7.png",
    },
    date: "13 / 05 / 2025",
    from: "Khobar",
    to: "Hofuf",
    status: "Completed",
    amount: "SAR 1200",
    image: ImageSampleMan,
  },
  {
    id: "8",
    user: { id: "u8", name: "Hegedüs Donát", avatar: "/avatars/avatar-8.png" },
    date: "13 / 05 / 2025",
    from: "Al Qassim",
    to: "Tabuk",
    status: "Completed",
    amount: "SAR 1200",
    image: ImageSampleMan,
  },
  {
    id: "9",
    user: { id: "u9", name: "Kovács Lajos", avatar: "/avatars/avatar-9.png" },
    date: "13 / 05 / 2025",
    from: "Abha",
    to: "Makkah",
    status: "Completed",
    amount: "SAR 1200",
    image: ImageSampleMan,
  },
];

const TransactionList: React.FC = () => {
  const { t } = useTranslation();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(15);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [totalCount, setTotalCount] = useState<number>(0);

    // Helper function to map API status to display status
  const mapApiStatus = (apiStatus: number): "Completed" | "Pending" | "Cancelled" => {
    switch (apiStatus) {
      case 1: return "Pending";
      case 2: return "Completed";
      case 3: return "Cancelled";
      default: return "Pending";
    }
  };

  // Helper function to transform API data to Transaction format
  const transformApiData = (apiData: any[]): Transaction[] => {
    return apiData.map((item, index) => ({
      id: item.uuid || item.ref || `txn-${index}`,
      user: {
        id: item.booking_id?.toString() || `user-${index}`,
        name: `User ${item.booking_id || index + 1}`,
        avatar: `/avatars/avatar-${(index % 9) + 1}.png`
      },
      date: new Date().toLocaleDateString('en-GB').replace(/\//g, ' / '), // Current date in DD/MM/YYYY format
      from: "Riyadh", // Default values since API doesn't provide these
      to: "Jeddah",   // Default values since API doesn't provide these
      status: mapApiStatus(item.status),
      amount: `SAR ${item.amount}`,
      image: "/assets/imagesampleman.png"
    }));
  };

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.getPaymentTransactions({
        page: currentPage,
        per_page: perPage,
        status: statusFilter !== "all" ? statusFilter : undefined,
        date_from: dateFrom || undefined,
        date_to: dateTo || undefined,
      });
      
      if (response.data && response.data.data) {
        // Transform API data to match Transaction type
        const transformedTransactions = transformApiData(response.data.data);
        setTransactions(transformedTransactions);
        setTotalPages(response.data.last_page || 1);
        setTotalCount(response.data.total || transformedTransactions.length);
      } else {
        // Fallback to static data if API doesn't return expected format
        console.warn("API didn't return expected transaction data, using static data");
        setTransactions(staticTransactions);
        setTotalPages(1);
        setTotalCount(staticTransactions.length);
      }
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError("Failed to load transactions. Using demo data.");
      // Fallback to static data on error
      setTransactions(staticTransactions);
      setTotalPages(1);
      setTotalCount(staticTransactions.length);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [currentPage, perPage, statusFilter, dateFrom, dateTo]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handlePerPageChange = (newPerPage: string) => {
    setPerPage(parseInt(newPerPage));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const handleStatusFilterChange = (newStatus: string) => {
    setStatusFilter(newStatus);
    setCurrentPage(1); // Reset to first page when changing filter
  };

  const handleDateFilterChange = (type: 'from' | 'to', value: string) => {
    if (type === 'from') {
      setDateFrom(value);
    } else {
      setDateTo(value);
    }
    setCurrentPage(1); // Reset to first page when changing date filter
  };

  return (
    <div className="bg-[#F8FAFB]">
      <Header title={t("transactions.title")} />
      <div className="p-6 md:p-10 lg:p-12 bg-white rounded-lg shadow-sm max-w-[1410px] mx-auto mb-10">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-4">
          <h1 className="text-2xl md:text-3xl text-[#222222]">
            {t("transactions.subtitle")}
          </h1>
          
          {/* Filter Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
            <div className="flex items-center gap-2">
              <label className="text-sm text-[#666666]">Status:</label>
              <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
                <SelectTrigger className="w-[120px] h-8 text-sm">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="2">Completed</SelectItem>
                  <SelectItem value="1">Pending</SelectItem>
                  <SelectItem value="3">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <label className="text-sm text-[#666666]">From:</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => handleDateFilterChange('from', e.target.value)}
                className="h-8 px-2 text-sm border border-[#EBEBEB] rounded"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <label className="text-sm text-[#666666]">To:</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => handleDateFilterChange('to', e.target.value)}
                className="h-8 px-2 text-sm border border-[#EBEBEB] rounded"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <label className="text-sm text-[#666666]">Per Page:</label>
              <Select value={perPage.toString()} onValueChange={handlePerPageChange}>
                <SelectTrigger className="w-[70px] h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="15">15</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Loading and Error States */}
        {loading && (
          <div className="text-center py-8">
            <div className="text-[#666666]">Loading transactions...</div>
          </div>
        )}
        
        {error && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* No Data State */}
        {!loading && transactions.length === 0 && (
          <div className="text-center py-8">
            <div className="text-[#666666]">No transactions found</div>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#F8FAFB] text-left text-sm font-medium text-[#666666] border-b border-[#EBEBEB]">
                <th className="py-4 px-4 rounded-tl-lg">
                  {t("transactions.table.user")}
                </th>
                <th className="py-4 px-4">{t("transactions.table.date")}</th>
                <th className="py-4 px-4">{t("transactions.table.from")}</th>
                <th className="py-4 px-4">{t("transactions.table.to")}</th>
                <th className="py-4 px-4">{t("transactions.table.status")}</th>
                <th className="py-4 px-4 rounded-tr-lg">
                  {t("transactions.table.amount")}
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, index) => (
                <tr
                  key={transaction.id}
                  className={`border-b border-[#EBEBEB] ${
                    index % 2 === 0 ? "bg-white" : "bg-white"
                  } hover:bg-[#F8FAFB] min-h-[60px]`} // Added min-h-[60px] for row height
                >
                  <td className="py-4 px-4 sm:py-5 sm:px-6">
                    {" "}
                    {/* Increased padding */}
                    <div className="flex items-center gap-3">
                      <img
                        src={transaction.image}
                        alt={transaction.user.name}
                        className="size-8 rounded-[10px]"
                      />
                      <span className="text-sm font-medium text-[#222222]">
                        {transaction.user.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 sm:py-5 sm:px-6 text-sm text-[#666666]">
                    {transaction.date}
                  </td>
                  <td className="py-4 px-4 sm:py-5 sm:px-6 text-sm text-[#666666]">
                    {transaction.from}
                  </td>
                  <td className="py-4 px-4 sm:py-5 sm:px-6 text-sm text-[#666666]">
                    {transaction.to}
                  </td>
                  <td className="py-4 px-4 sm:py-5 sm:px-6 text-sm">
                    <span
                      className={
                        transaction.status === "Completed"
                          ? "text-[#00F076]"
                          : "text-[#666666]"
                      }
                    >
                      {t(
                        `transaction_list.status_${transaction.status.toLowerCase()}`
                      )}
                    </span>
                  </td>
                  <td className="py-4 px-4 sm:py-5 sm:px-6 text-sm font-medium text-[#222222]">
                    {transaction.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {!loading && transactions.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
            <div className="text-sm text-[#666666]">
              Showing {((currentPage - 1) * perPage) + 1} to {Math.min(currentPage * perPage, totalCount)} of {totalCount} entries
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="h-8 px-3"
              >
                <ChevronLeft className="size-4" />
                Previous
              </Button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(pageNum)}
                      className="h-8 w-8"
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                {totalPages > 5 && (
                  <>
                    <span className="px-2">...</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(totalPages)}
                      className="h-8 w-8"
                    >
                      {totalPages}
                    </Button>
                  </>
                )}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="h-8 px-3"
              >
                Next
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default TransactionList;
