import { pdf } from "@react-pdf/renderer";
import ReceiptPdf from "../components/admin/receipts/pdf/ReceiptPdf";

export async function downloadReceiptPDF(receipt) {

    const donorName = (
        receipt.full_name ||
        receipt.donor_name ||
        "Donor"
    )
        .trim()
        .replace(/\s+/g, "_")
        .replace(/[^\w]/g, "");

    const fileName =
        `${receipt.receipt_code}_${donorName}.pdf`;

    // Generate PDF Blob
    const blob = await pdf(
        <ReceiptPdf receipt={receipt} />
    ).toBlob();

    // Create Download Link
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = fileName;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

}