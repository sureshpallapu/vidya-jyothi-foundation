import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import {
    getReceipts,
    archiveReceipt,
    cancelReceipt,
} from "../../../api/receiptApi";

import ReceiptHeader from "../../../components/admin/receipts/ReceiptHeader";
import ReceiptFilters from "../../../components/admin/receipts/ReceiptFilters";
import ReceiptTable from "../../../components/admin/receipts/ReceiptTable";
import ReceiptPagination from "../../../components/admin/receipts/ReceiptPagination";

export default function ReceiptList() {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    const [receipts, setReceipts] = useState([]);

    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
    });

    const [filters, setFilters] = useState({
        search: "",
        receiptStatus: "",
        receiptType: "",
        financialYear: "",
        fromDate: "",
        toDate: "",
    });

    useEffect(() => {
        loadReceipts();
    }, [pagination.page]);

    /*
    |--------------------------------------------------------------------------
    | Load Receipts
    |--------------------------------------------------------------------------
    */

    async function loadReceipts() {

        try {

            setLoading(true);

            const response = await getReceipts({
                ...filters,
                page: pagination.page,
                limit: pagination.limit,
            });

            const data = response.data.data;

            setReceipts(data.receipts || []);

            setPagination((prev) => ({
                ...prev,
                total: data.total,
                totalPages: data.totalPages,
            }));

        } catch (error) {

    console.error("Receipt API Error:", error);

    console.log("Status:", error.response?.status);

    console.log("Response:", error.response?.data);

    Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || error.message,
    });

}finally {

            setLoading(false);

        }

    }

    /*
    |--------------------------------------------------------------------------
    | Reset Filters
    |--------------------------------------------------------------------------
    */

    const resetFilters = () => {

        setFilters({
            search: "",
            receiptStatus: "",
            receiptType: "",
            financialYear: "",
            fromDate: "",
            toDate: "",
        });

        setPagination((prev) => ({
            ...prev,
            page: 1,
        }));

        setTimeout(loadReceipts, 0);

    };

    /*
    |--------------------------------------------------------------------------
    | Pagination
    |--------------------------------------------------------------------------
    */

    const handlePageChange = (page) => {

        setPagination((prev) => ({
            ...prev,
            page,
        }));

    };

    /*
    |--------------------------------------------------------------------------
    | View Receipt
    |--------------------------------------------------------------------------
    */

    const handleView = (receipt) => {

        navigate(`/admin/receipts/${receipt.receipt_code}`);

    };

    /*
    |--------------------------------------------------------------------------
    | Archive Receipt
    |--------------------------------------------------------------------------
    */

    const handleArchive = async (receipt) => {

        const result = await Swal.fire({
            title: "Archive Receipt?",
            text: "You can restore it later.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Archive",
        });

        if (!result.isConfirmed) return;

        try {

            await archiveReceipt(receipt.receipt_code);

            Swal.fire({
                icon: "success",
                title: "Receipt Archived",
                timer: 1500,
                showConfirmButton: false,
            });

            loadReceipts();

        } catch (error) {

            console.error(error);

            Swal.fire({
                icon: "error",
                title: "Archive Failed",
            });

        }

    };

    /*
    |--------------------------------------------------------------------------
    | Cancel Receipt
    |--------------------------------------------------------------------------
    */

    const handleCancel = async (receipt) => {

        const result = await Swal.fire({
            title: "Cancel Receipt?",
            input: "textarea",
            inputPlaceholder: "Enter cancellation reason...",
            showCancelButton: true,
            confirmButtonText: "Cancel Receipt",
        });

        if (!result.isConfirmed) return;

        try {

         await cancelReceipt(receipt.receipt_code, {
    cancelled_reason: result.value || "Cancelled by Admin",
    cancelled_by: 1,
    updated_by: 1,
});

            Swal.fire({
                icon: "success",
                title: "Receipt Cancelled",
                timer: 1500,
                showConfirmButton: false,
            });

            loadReceipts();

        } catch (error) {
console.log("Status:", error.response?.status);

console.log("Data:", error.response?.data);

console.log("Message:", error.response?.data?.message);

console.log("Errors:", error.response?.data?.errors);


            Swal.fire({
                icon: "error",
                title: "Cancellation Failed",
            });

        }

    };

    /*
    |--------------------------------------------------------------------------
    | Print Receipt
    |--------------------------------------------------------------------------
    */

    const handlePrint = () => {

        window.print();

    };

    /*
    |--------------------------------------------------------------------------
    | Download PDF
    |--------------------------------------------------------------------------
    */

    const handlePDF = () => {

        Swal.fire({
            icon: "info",
            title: "Coming Soon",
            text: "PDF download will be implemented next.",
        });

    };

    return (

        <div className="space-y-6">

            <ReceiptHeader
                onRefresh={loadReceipts}
                onExportExcel={() => {}}
                onExportPDF={() => {}}
            />

            <ReceiptFilters
                filters={filters}
                setFilters={setFilters}
                onSearch={loadReceipts}
                onReset={resetFilters}
            />

            <ReceiptTable
                receipts={receipts}
                loading={loading}
                onView={handleView}
                onPrint={handlePrint}
                onPDF={handlePDF}
                onArchive={handleArchive}
                onCancel={handleCancel}
            />

            <ReceiptPagination
                pagination={pagination}
                onPageChange={handlePageChange}
            />

        </div>

    );

}