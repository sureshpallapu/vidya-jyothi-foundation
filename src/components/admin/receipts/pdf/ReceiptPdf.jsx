import {
    Document,
    Page,
    View,
    Text,
    Image,
    StyleSheet,
} from "@react-pdf/renderer";

import { toWords } from "number-to-words";
import QRCode from "react-qr-code";

/* ==============================================================
   NOTE ON QR CODE
   --------------------------------------------------------------
   `react-qr-code` renders an <svg> directly to the DOM and is not
   compatible with @react-pdf/renderer's own renderer. To keep the
   QR code inside the generated PDF, we generate a QR code as a
   base64 PNG data URL (using the `qrcode` package) and render it
   with @react-pdf/renderer's <Image /> component instead.

   npm install qrcode
   ========================================================== */

const styles = StyleSheet.create({

    page: {
        padding: 32,
        fontSize: 10,
        fontFamily: "Helvetica",
        color: "#1f2937",
    },

    /* ---------------- HEADER ---------------- */

    header: {
        borderBottomWidth: 2,
        borderBottomColor: "#334155",
        paddingBottom: 14,
        marginBottom: 18,
        flexDirection: "row",
        justifyContent: "space-between",
    },

    orgName: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#1E3A8A",
        letterSpacing: 0.5,
    },

    orgLine: {
        fontSize: 9,
        color: "#374151",
        marginTop: 2,
    },

    orgRegLine: {
        fontSize: 8,
        color: "#6B7280",
        marginTop: 6,
    },

    headerRight: {
        width: 210,
    },

    receiptTitle: {
        fontSize: 15,
        fontWeight: "bold",
        textAlign: "right",
        marginBottom: 8,
    },

    metaRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 3,
    },

    metaLabel: {
        fontSize: 9,
        fontWeight: "bold",
        color: "#374151",
    },

    metaValue: {
        fontSize: 9,
        textAlign: "right",
    },

    metaValueStatus: {
        fontSize: 9,
        fontWeight: "bold",
        color: "#15803d",
        textAlign: "right",
    },

    /* ---------------- SECTION ---------------- */

    sectionWrap: {
        marginTop: 16,
    },

    sectionHeader: {
        backgroundColor: "#334155",
        color: "#ffffff",
        paddingVertical: 5,
        paddingHorizontal: 8,
        fontSize: 10,
        fontWeight: "bold",
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },

    table: {
        borderWidth: 1,
        borderColor: "#000000",
        borderTopWidth: 0,
    },

    row: {
        flexDirection: "row",
    },

    cellLabel: {
        width: "22%",
        borderRightWidth: 1,
        borderTopWidth: 1,
        borderColor: "#000000",
        backgroundColor: "#F8FAFC",
        padding: 6,
        fontWeight: "bold",
        fontSize: 9,
    },

    cellValue: {
        width: "28%",
        borderRightWidth: 1,
        borderTopWidth: 1,
        borderColor: "#000000",
        padding: 6,
        fontSize: 9,
    },

    cellValueWide: {
        width: "78%",
        borderTopWidth: 1,
        borderColor: "#000000",
        padding: 6,
        fontSize: 9,
    },

    cellValueLast: {
        width: "28%",
        borderTopWidth: 1,
        borderColor: "#000000",
        padding: 6,
        fontSize: 9,
    },

    /* ---------------- SUMMARY ---------------- */

    summaryBox: {
        borderWidth: 1,
        borderTopWidth: 0,
        borderColor: "#000000",
        padding: 14,
    },

    summaryTopRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },

    summaryLabel: {
        fontSize: 9,
        color: "#4B5563",
    },

    summaryAmount: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#15803d",
        marginTop: 3,
    },

    badge: {
        marginTop: 6,
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 10,
        fontSize: 9,
        fontWeight: "bold",
        alignSelf: "flex-end",
    },

    badgeEligible: {
        backgroundColor: "#DCFCE7",
        color: "#15803d",
    },

    badgeNotEligible: {
        backgroundColor: "#FEE2E2",
        color: "#B91C1C",
    },

    wordsBox: {
        marginTop: 14,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 4,
        backgroundColor: "#F8FAFC",
        padding: 10,
    },

    wordsLabel: {
        fontSize: 8,
        fontWeight: "bold",
        color: "#4B5563",
        textTransform: "uppercase",
    },

    wordsValue: {
        fontSize: 10,
        fontWeight: "bold",
        color: "#1e293b",
        marginTop: 4,
        lineHeight: 1.5,
    },

    /* ---------------- DECLARATION ---------------- */

    declarationBox: {
        marginTop: 16,
        borderWidth: 1,
        borderColor: "#000000",
        borderRadius: 4,
        overflow: "hidden",
    },

    declarationHeader: {
        backgroundColor: "#334155",
        color: "#ffffff",
        paddingVertical: 5,
        paddingHorizontal: 8,
        fontSize: 10,
        fontWeight: "bold",
        textTransform: "uppercase",
    },

    declarationBody: {
        padding: 12,
    },

    declarationText: {
        fontSize: 9.5,
        lineHeight: 1.6,
        textAlign: "justify",
        color: "#374151",
    },

    bold: {
        fontWeight: "bold",
    },

    /* ---------------- FOOTER ---------------- */

    footerRow: {
        marginTop: 22,
        flexDirection: "row",
        justifyContent: "space-between",
    },

    qrBox: {
        borderWidth: 1,
        borderColor: "#000000",
        borderRadius: 4,
        padding: 10,
        width: 100,
        alignItems: "center",
    },

    qrImage: {
        width: 80,
        height: 80,
    },

    qrCaption: {
        marginTop: 6,
        fontSize: 9,
        fontWeight: "bold",
    },

    qrSub: {
        fontSize: 7,
        color: "#6B7280",
        marginTop: 2,
        textAlign: "center",
    },

    signatureWrap: {
        alignItems: "flex-end",
        justifyContent: "flex-end",
    },

    signatureLine: {
        borderTopWidth: 1,
        borderTopColor: "#374151",
        width: 180,
        marginTop: 40,
    },

    signatureLabel: {
        marginTop: 4,
        fontSize: 9,
        fontWeight: "bold",
        textAlign: "right",
    },

    signatureSub: {
        fontSize: 8,
        textAlign: "right",
        color: "#374151",
    },

    signatureNote: {
        fontSize: 7,
        textAlign: "right",
        color: "#6B7280",
        marginTop: 4,
    },

    /* ---------------- BOTTOM FOOTER ---------------- */

    bottomFooter: {
        marginTop: 26,
        borderTopWidth: 1,
        borderTopColor: "#D1D5DB",
        paddingTop: 8,
        textAlign: "center",
    },

    bottomFooterText: {
        fontSize: 8,
        color: "#6B7280",
    },

});

/* ==============================================================
   Helpers
========================================================== */

const formatCurrency = (amount) =>

    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 2,
    }).format(Number(amount || 0));

const formatDate = (date) =>

    date
        ? new Date(date).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "long",
              year: "numeric",
          })
        : "-";

const amountInWords = (amount) => {

    const value = Number(amount || 0);

    if (value === 0) {
        return "Zero Rupees Only";
    }

    return (
        toWords(Math.floor(value))
            .replace(/\b\w/g, (char) => char.toUpperCase()) +
        " Rupees Only"
    );

};

/* ==============================================================
   Async helper to build a data-URL QR code image.
   Call this BEFORE rendering <ReceiptPdf />, e.g.:

   const qrDataUrl = await generateReceiptQrCode(receipt);
   <ReceiptPdf receipt={receipt} qrDataUrl={qrDataUrl} />
========================================================== */

export async function generateReceiptQrCode(receipt, origin = "") {

    const verificationUrl =
        `${origin || (typeof window !== "undefined" ? window.location.origin : "")}/verify/${receipt.receipt_code}`;

    return QRCode.toDataURL(verificationUrl, {
        margin: 1,
        width: 200,
    });

}

export default function ReceiptPdf({ receipt, qrDataUrl }) {

    return (

        <Document>

            <Page
                size="A4"
                style={styles.page}
            >

                {/* ==================== HEADER ==================== */}

                <View style={styles.header}>

                    <View>

                        <Text style={styles.orgName}>
                            VIDYA JYOTHI FOUNDATION
                        </Text>

                        <Text style={styles.orgLine}>
                            Guntur, Andhra Pradesh
                        </Text>

                        <Text style={styles.orgLine}>
                            support@vidyajyothifoundation.org
                        </Text>

                        <Text style={styles.orgLine}>
                            +91 XXXXX XXXXX
                        </Text>

                        <Text style={styles.orgRegLine}>
                            Reg. No : ____________________  |  PAN : ____________________
                        </Text>

                    </View>

                    <View style={styles.headerRight}>

                        <Text style={styles.receiptTitle}>
                            DONATION RECEIPT
                        </Text>

                        <View style={styles.metaRow}>

                            <Text style={styles.metaLabel}>
                                Receipt No
                            </Text>

                            <Text style={styles.metaValue}>
                                {receipt.receipt_code}
                            </Text>

                        </View>

                        <View style={styles.metaRow}>

                            <Text style={styles.metaLabel}>
                                Receipt Date
                            </Text>

                            <Text style={styles.metaValue}>
                                {formatDate(receipt.receipt_date)}
                            </Text>

                        </View>

                        <View style={styles.metaRow}>

                            <Text style={styles.metaLabel}>
                                Status
                            </Text>

                            <Text style={styles.metaValueStatus}>
                                {receipt.receipt_status || receipt.status}
                            </Text>

                        </View>

                    </View>

                </View>

                {/* ==================== DONOR INFORMATION ==================== */}

                <View style={styles.sectionWrap}>

                    <Text style={styles.sectionHeader}>
                        Donor Information
                    </Text>

                    <View style={styles.table}>

                        <View style={styles.row}>

                            <Text style={styles.cellLabel}>
                                Donor Name
                            </Text>

                            <Text style={styles.cellValue}>
                                {receipt.donor_name || "-"}
                            </Text>

                            <Text style={styles.cellLabel}>
                                Mobile
                            </Text>

                            <Text style={styles.cellValueLast}>
                                {receipt.mobile || "-"}
                            </Text>

                        </View>

                        <View style={styles.row}>

                            <Text style={styles.cellLabel}>
                                Email
                            </Text>

                            <Text style={styles.cellValue}>
                                {receipt.email || "-"}
                            </Text>

                            <Text style={styles.cellLabel}>
                                Payment Mode
                            </Text>

                            <Text style={styles.cellValueLast}>
                                {receipt.payment_mode || "-"}
                            </Text>

                        </View>

                        <View style={styles.row}>

                            <Text style={styles.cellLabel}>
                                Address
                            </Text>

                            <Text style={styles.cellValueWide}>
                                {receipt.address || "-"}
                            </Text>

                        </View>

                    </View>

                </View>

                {/* ==================== DONATION INFORMATION ==================== */}

                <View style={styles.sectionWrap}>

                    <Text style={styles.sectionHeader}>
                        Donation Information
                    </Text>

                    <View style={styles.table}>

                        <View style={styles.row}>

                            <Text style={styles.cellLabel}>
                                Donation Type
                            </Text>

                            <Text style={styles.cellValue}>
                                {receipt.donation_type || "General Donation"}
                            </Text>

                            <Text style={styles.cellLabel}>
                                Receipt Type
                            </Text>

                            <Text style={styles.cellValueLast}>
                                {receipt.receipt_type || "ORIGINAL"}
                            </Text>

                        </View>

                        <View style={styles.row}>

                            <Text style={styles.cellLabel}>
                                Donation Purpose
                            </Text>

                            <Text style={styles.cellValue}>
                                {receipt.donation_purpose || "-"}
                            </Text>

                            <Text style={styles.cellLabel}>
                                Payment Mode
                            </Text>

                            <Text style={styles.cellValueLast}>
                                {receipt.payment_mode || "-"}
                            </Text>

                        </View>

                        <View style={styles.row}>

                            <Text style={styles.cellLabel}>
                                Reference No
                            </Text>

                            <Text style={styles.cellValue}>
                                {receipt.reference_number || "-"}
                            </Text>

                            <Text style={styles.cellLabel}>
                                Transaction ID
                            </Text>

                            <Text style={styles.cellValueLast}>
                                {receipt.transaction_id || "-"}
                            </Text>

                        </View>

                        <View style={styles.row}>

                            <Text style={styles.cellLabel}>
                                Donation Date
                            </Text>

                            <Text style={styles.cellValue}>
                                {formatDate(
                                    receipt.donation_date ||
                                    receipt.receipt_date
                                )}
                            </Text>

                            <Text style={styles.cellLabel}>
                                Financial Year
                            </Text>

                            <Text style={styles.cellValueLast}>
                                {receipt.financial_year || "-"}
                            </Text>

                        </View>

                    </View>

                </View>

                {/* ==================== DONATION SUMMARY ==================== */}

                <View style={styles.sectionWrap}>

                    <Text style={styles.sectionHeader}>
                        Donation Summary
                    </Text>

                    <View style={styles.summaryBox}>

                        <View style={styles.summaryTopRow}>

                            <View>

                                <Text style={styles.summaryLabel}>
                                    Total Donation Amount
                                </Text>

                                <Text style={styles.summaryAmount}>
                                    {formatCurrency(receipt.amount)}
                                </Text>

                            </View>

                            <View>

                                <Text
                                    style={[
                                        styles.summaryLabel,
                                        { textAlign: "right" },
                                    ]}
                                >
                                    Tax Exemption
                                </Text>

                                <Text
                                    style={[
                                        styles.badge,
                                        receipt.tax_exemption
                                            ? styles.badgeEligible
                                            : styles.badgeNotEligible,
                                    ]}
                                >
                                    {receipt.tax_exemption
                                        ? "Eligible"
                                        : "Not Applicable"}
                                </Text>

                            </View>

                        </View>

                        <View style={styles.wordsBox}>

                            <Text style={styles.wordsLabel}>
                                Amount in Words
                            </Text>

                            <Text style={styles.wordsValue}>
                                {amountInWords(receipt.amount)}
                            </Text>

                        </View>

                    </View>

                </View>

                {/* ==================== DECLARATION ==================== */}

                <View style={styles.declarationBox}>

                    <Text style={styles.declarationHeader}>
                        Declaration
                    </Text>

                    <View style={styles.declarationBody}>

                        <Text style={styles.declarationText}>
                            Received with sincere thanks from{" "}
                            <Text style={styles.bold}>
                                {receipt.donor_name}
                            </Text>
                            {" "}towards the charitable and educational
                            activities of{" "}
                            <Text style={styles.bold}>
                                Vidya Jyothi Foundation.
                            </Text>
                            {" "}This receipt has been generated
                            electronically and is valid without a
                            physical signature.
                        </Text>

                    </View>

                </View>

                {/* ==================== FOOTER: QR + SIGNATURE ==================== */}

                <View style={styles.footerRow}>

                    <View style={styles.qrBox}>

                        {qrDataUrl ? (
                            <Image
                                src={qrDataUrl}
                                style={styles.qrImage}
                            />
                        ) : (
                            <Text style={{ fontSize: 8 }}>
                                QR unavailable
                            </Text>
                        )}

                        <Text style={styles.qrCaption}>
                            Scan to Verify Receipt
                        </Text>

                        <Text style={styles.qrSub}>
                            {receipt.receipt_code}
                        </Text>

                        <Text style={styles.qrSub}>
                            Verify the authenticity of this receipt
                            using the QR code.
                        </Text>

                    </View>

                    <View style={styles.signatureWrap}>

                        <View style={styles.signatureLine} />

                        <Text style={styles.signatureLabel}>
                            Authorized Signatory
                        </Text>

                        <Text style={styles.signatureSub}>
                            Vidya Jyothi Foundation
                        </Text>

                        <Text style={styles.signatureNote}>
                            This is a computer-generated receipt.
                        </Text>

                    </View>

                </View>

                {/* ==================== BOTTOM FOOTER ==================== */}

                <View style={styles.bottomFooter}>

                    <Text style={styles.bottomFooterText}>
                        Vidya Jyothi Foundation
                    </Text>

                    <Text style={styles.bottomFooterText}>
                        Guntur, Andhra Pradesh
                    </Text>

                    <Text style={styles.bottomFooterText}>
                        support@vidyajyothifoundation.org  |  +91 XXXXX XXXXX
                    </Text>

                    <Text style={[styles.bottomFooterText, { marginTop: 6 }]}>
                        Generated On : {new Date().toLocaleString("en-IN")}
                    </Text>

                </View>

            </Page>

        </Document>

    );

}