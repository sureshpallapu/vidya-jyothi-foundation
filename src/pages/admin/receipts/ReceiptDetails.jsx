import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

import {
  getReceipt,
  archiveReceipt,
  restoreReceipt,
} from "../../../api/receiptApi";

import ReceiptDetailsHeader from "../../../components/admin/receipts/ReceiptDetailsHeader";
import ReceiptViewer from "../../../components/admin/receipts/viewer/ReceiptViewer";
import ReceiptToolbar from "../../../components/admin/receipts/viewer/ReceiptToolbar";
import { downloadReceiptPDF }
from "../../../utils/downloadReceiptPdf";


export default function ReceiptDetails() {
  const navigate = useNavigate();
  const { receiptCode } = useParams();

  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReceipt();
  }, [receiptCode]);

  const fetchReceipt = async () => {
    try {
      setLoading(true);

      const response = await getReceipt(receiptCode);
      setReceipt(response.data.data);
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Unable to load receipt.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleArchive = async () => {
    try {
      await archiveReceipt(receipt.receipt_code);

      Swal.fire({
        icon: "success",
        title: "Receipt Archived",
        timer: 1500,
        showConfirmButton: false,
      });

      fetchReceipt();
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Archive Failed",
        text: "Unable to archive receipt.",
      });
    }
  };

  const handleRestore = async () => {
    try {
      await restoreReceipt(receipt.receipt_code);

      Swal.fire({
        icon: "success",
        title: "Receipt Restored",
        timer: 1500,
        showConfirmButton: false,
      });

      fetchReceipt();
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Restore Failed",
        text: "Unable to restore receipt.",
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };
const handleDownloadPDF = async () => {

    try {

        await downloadReceiptPDF(receipt);

        Swal.fire({
            icon: "success",
            title: "PDF Downloaded",
            text: "Receipt downloaded successfully.",
            timer: 1800,
            showConfirmButton: false,
        });

    } catch (error) {

        console.error(error);

        Swal.fire({
            icon: "error",
            title: "Download Failed",
            text: error.message,
        });

    }

};

  const handleEmail = () => {
    Swal.fire({
      icon: "info",
      title: "Coming Soon",
      text: "Email Receipt feature will be implemented next.",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <span className="text-lg font-semibold text-gray-700">
          Loading Receipt...
        </span>
      </div>
    );
  }

  if (!receipt) {
    return (
      <div className="flex items-center justify-center h-96">
        <span className="text-lg font-semibold text-red-600">
          Receipt not found.
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* ================= Header ================= */}

      <div className="no-print">
        <ReceiptDetailsHeader
          receipt={receipt}
          onBack={() => navigate("/admin/receipts")}
        />
      </div>

      {/* ================= Receipt Preview ================= */}

      <ReceiptViewer
        receipt={receipt}
      />

      {/* ================= Action Toolbar ================= */}

      <div className="no-print">
        <ReceiptToolbar
    receipt={receipt}
    onBack={() => navigate("/admin/receipts")}
    onPrint={handlePrint}
    onDownloadPDF={handleDownloadPDF}
    onEmail={handleEmail}
    onArchive={handleArchive}
    onRestore={handleRestore}
/>
      </div>

    </div>
  );
}
