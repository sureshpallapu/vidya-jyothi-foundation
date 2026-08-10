const PDFDocument = require("pdfkit");
const QRCode = require("qrcode");
const { toWords } = require("number-to-words");
const fs = require("fs");
const os = require("os");
const path = require("path");

/*
|--------------------------------------------------------------------------
| Generate Donation Receipt PDF
|--------------------------------------------------------------------------
| Note on structure: the original code wrapped the whole function body
| (including the `await QRCode.toDataURL(...)` call) inside
| `new Promise(async (resolve, reject) => {...})`. An async executor is
| an anti-pattern — a rejection thrown inside it does not reliably
| propagate to `.catch()` / `reject()`, and it hides genuine async bugs.
| Here, the async QR generation happens first (plain `await`), and only
| the synchronous PDFKit drawing + file stream is wrapped in a Promise
| (which is the part that actually needs to be awaited: waiting for the
| write stream's "finish" event).
|--------------------------------------------------------------------------
*/

async function generateReceiptPDF(receipt) {

    /*
    |--------------------------------------------------------------------------
    | File Name
    |--------------------------------------------------------------------------
    */

    const donorName = (
        receipt.full_name ||
        receipt.donor_name ||
        "Donor"
    )
        .replace(/\s+/g, "_")
        .replace(/[^\w]/g, "");

    const fileName = `${receipt.receipt_code}_${donorName}.pdf`;

    const pdfPath = path.join(os.tmpdir(), fileName);

    /*
    |--------------------------------------------------------------------------
    | Format Helpers
    |--------------------------------------------------------------------------
    */

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
                  month: "short",
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

    /*
    |--------------------------------------------------------------------------
    | QR Code
    |--------------------------------------------------------------------------
    | Generated up front (it's async) so the rest of the function below is
    | plain synchronous PDFKit drawing.
    */

    const verificationUrl =
        `${process.env.FRONTEND_URL || ""}/verify/${receipt.receipt_code}`;

    const qrImage = await QRCode.toDataURL(verificationUrl, {
        margin: 1,
        width: 200,
    });

    /*
    |--------------------------------------------------------------------------
    | Build & Write PDF
    |--------------------------------------------------------------------------
    */

    return new Promise((resolve, reject) => {

        try {

            const doc = new PDFDocument({
                size: "A4",
                margin: 40,
            });

            const stream = fs.createWriteStream(pdfPath);

            doc.pipe(stream);
            doc.font("Helvetica");

            const marginX = 40;
            const contentWidth = doc.page.width - marginX * 2; // 515

            /* ==========================================================
               Small drawing helpers
            ========================================================== */

            const labelW = 100;
            const value1W = 155;
            const label2W = 90;
            const value2W = contentWidth - labelW - value1W - label2W;

            const sectionHeader = (title, y) => {

                doc
                    .rect(marginX, y, contentWidth, 20)
                    .fill("#334155");

                doc
                    .fillColor("#ffffff")
                    .font("Helvetica-Bold")
                    .fontSize(10)
                    .text(title.toUpperCase(), marginX + 8, y + 5.5);

                doc.fillColor("#000000");

                return y + 20;
            };

            // A row with two label/value pairs, e.g. | Donor Name | value | Mobile | value |
            const twoColRow = (y, label1, value1, label2, value2) => {

                const rowH = 22;

                // borders
                doc
                    .rect(marginX, y, contentWidth, rowH)
                    .strokeColor("#000000")
                    .lineWidth(0.7)
                    .stroke();

                doc
                    .moveTo(marginX + labelW, y)
                    .lineTo(marginX + labelW, y + rowH)
                    .stroke();

                doc
                    .moveTo(marginX + labelW + value1W, y)
                    .lineTo(marginX + labelW + value1W, y + rowH)
                    .stroke();

                doc
                    .moveTo(marginX + labelW + value1W + label2W, y)
                    .lineTo(marginX + labelW + value1W + label2W, y + rowH)
                    .stroke();

                // label backgrounds
                doc.rect(marginX, y, labelW, rowH).fill("#F8FAFC");
                doc.rect(marginX + labelW + value1W, y, label2W, rowH).fill("#F8FAFC");
                doc.fillColor("#000000");

                doc.font("Helvetica-Bold").fontSize(9)
                    .text(label1, marginX + 6, y + 7, { width: labelW - 10 });
                doc.font("Helvetica").fontSize(9)
                    .text(value1 || "-", marginX + labelW + 6, y + 7, { width: value1W - 12 });
                doc.font("Helvetica-Bold").fontSize(9)
                    .text(label2, marginX + labelW + value1W + 6, y + 7, { width: label2W - 10 });
                doc.font("Helvetica").fontSize(9)
                    .text(value2 || "-", marginX + labelW + value1W + label2W + 6, y + 7, { width: value2W - 12 });

                return y + rowH;
            };

            // A row spanning the full width with one label + one wide value, e.g. Address
            const wideRow = (y, label, value) => {

                const rowH = 22;

                doc
                    .rect(marginX, y, contentWidth, rowH)
                    .strokeColor("#000000")
                    .lineWidth(0.7)
                    .stroke();

                doc
                    .moveTo(marginX + labelW, y)
                    .lineTo(marginX + labelW, y + rowH)
                    .stroke();

                doc.rect(marginX, y, labelW, rowH).fill("#F8FAFC");
                doc.fillColor("#000000");

                doc.font("Helvetica-Bold").fontSize(9)
                    .text(label, marginX + 6, y + 7, { width: labelW - 10 });
                doc.font("Helvetica").fontSize(9)
                    .text(value || "-", marginX + labelW + 6, y + 7, { width: contentWidth - labelW - 12 });

                return y + rowH;
            };

            /* ==========================================================
               HEADER
            ========================================================== */

            doc
                .fillColor("#1E3A8A")
                .font("Helvetica-Bold")
                .fontSize(20)
                .text("VIDYA JYOTHI FOUNDATION", marginX, 40);

            doc
                .fillColor("#333333")
                .font("Helvetica")
                .fontSize(9)
                .text("Guntur, Andhra Pradesh", marginX, 64)
                .text("support@vidyajyothifoundation.org")
                .text("+91 XXXXX XXXXX");

            doc
                .fillColor("#666666")
                .fontSize(8)
                .text("Reg. No : ____________________   |   PAN : ____________________");

            const metaX = 350;
            const metaWidth = marginX + contentWidth - metaX; // 165

            doc
                .fillColor("#000000")
                .font("Helvetica-Bold")
                .fontSize(15)
                .text("DONATION RECEIPT", metaX, 40, {
                    width: metaWidth,
                    align: "right",
                });

            const metaRow = (label, value, y, valueColor) => {

                doc
                    .font("Helvetica-Bold")
                    .fontSize(9)
                    .fillColor("#000000")
                    .text(label, metaX, y, {
                        width: metaWidth * 0.45,
                    });

                doc
                    .font("Helvetica-Bold")
                    .fontSize(9)
                    .fillColor(valueColor || "#000000")
                    .text(value, metaX + metaWidth * 0.45, y, {
                        width: metaWidth * 0.55,
                        align: "right",
                    });

                doc.fillColor("#000000").font("Helvetica");
            };

            metaRow("Receipt No", receipt.receipt_code, 68);
            metaRow("Receipt Date", formatDate(receipt.receipt_date), 84);
            metaRow(
                "Status",
                receipt.receipt_status || receipt.status || "-",
                100,
                "#15803d"
            );

            doc
                .moveTo(marginX, 128)
                .lineTo(marginX + contentWidth, 128)
                .strokeColor("#334155")
                .lineWidth(1.2)
                .stroke();

            let y = 145;

            /* ==========================================================
               DONOR INFORMATION
            ========================================================== */

            y = sectionHeader("Donor Information", y);

            y = twoColRow(
                y,
                "Donor Name",
                receipt.full_name || receipt.donor_name || "-",
                "Mobile",
                receipt.mobile || "-"
            );

            y = twoColRow(
                y,
                "Email",
                receipt.email || "-",
                "Payment Mode",
                receipt.payment_mode || "-"
            );

            y = wideRow(y, "Address", receipt.address || "-");

            /* ==========================================================
               DONATION INFORMATION
            ========================================================== */

            y += 14;
            y = sectionHeader("Donation Information", y);

            y = twoColRow(
                y,
                "Donation Type",
                receipt.donation_type || "General Donation",
                "Receipt Type",
                receipt.receipt_type || "ORIGINAL"
            );

            y = twoColRow(
                y,
                "Donation Purpose",
                receipt.donation_purpose || "-",
                "Payment Mode",
                receipt.payment_mode || "-"
            );

            y = twoColRow(
                y,
                "Reference No",
                receipt.reference_number || "-",
                "Transaction ID",
                receipt.transaction_id || "-"
            );

            y = twoColRow(
                y,
                "Donation Date",
                formatDate(receipt.donation_date || receipt.receipt_date),
                "Financial Year",
                receipt.financial_year || "-"
            );

            /* ==========================================================
               DONATION SUMMARY
            ========================================================== */

            y += 14;
            y = sectionHeader("Donation Summary", y);

            const summaryBoxH = 90;

            doc
                .rect(marginX, y, contentWidth, summaryBoxH)
                .strokeColor("#000000")
                .lineWidth(0.7)
                .stroke();

            doc
                .fillColor("#4B5563")
                .font("Helvetica")
                .fontSize(9)
                .text("Total Donation Amount", marginX + 12, y + 12);

            doc
                .fillColor("#15803d")
                .font("Helvetica-Bold")
                .fontSize(18)
                .text(formatCurrency(receipt.amount), marginX + 12, y + 26);

            const isEligible = !!receipt.tax_exemption;

            doc
                .fillColor("#4B5563")
                .font("Helvetica")
                .fontSize(9)
                .text("Tax Exemption", marginX, y + 12, {
                    width: contentWidth - 12,
                    align: "right",
                });

            const badgeText = isEligible ? "Eligible" : "Not Applicable";
            const badgeW = doc.widthOfString(badgeText, { font: "Helvetica-Bold", size: 9 }) + 20;
            const badgeX = marginX + contentWidth - 12 - badgeW;
            const badgeY = y + 26;

            doc
                .roundedRect(badgeX, badgeY, badgeW, 18, 9)
                .fill(isEligible ? "#DCFCE7" : "#FEE2E2");

            doc
                .fillColor(isEligible ? "#15803d" : "#B91C1C")
                .font("Helvetica-Bold")
                .fontSize(9)
                .text(badgeText, badgeX, badgeY + 5, {
                    width: badgeW,
                    align: "center",
                });

            doc
                .rect(marginX + 12, y + 50, contentWidth - 24, 32)
                .fillAndStroke("#F8FAFC", "#E5E7EB");

            doc
                .fillColor("#4B5563")
                .font("Helvetica-Bold")
                .fontSize(7.5)
                .text("AMOUNT IN WORDS", marginX + 20, y + 56);

            doc
                .fillColor("#1e293b")
                .font("Helvetica-Bold")
                .fontSize(9.5)
                .text(amountInWords(receipt.amount), marginX + 20, y + 68, {
                    width: contentWidth - 40,
                });

            doc.fillColor("#000000").font("Helvetica");

            y += summaryBoxH;

            /* ==========================================================
               DECLARATION
            ========================================================== */

            y += 14;

            doc
                .rect(marginX, y, contentWidth, 20)
                .fill("#334155");

            doc
                .fillColor("#ffffff")
                .font("Helvetica-Bold")
                .fontSize(10)
                .text("DECLARATION", marginX + 8, y + 5.5);

            doc.fillColor("#000000");

            y += 20;

            const declarationH = 46;

            doc
                .rect(marginX, y, contentWidth, declarationH)
                .strokeColor("#000000")
                .lineWidth(0.7)
                .stroke();

            doc
                .font("Helvetica")
                .fontSize(9.5)
                .fillColor("#374151")
                .text(
                    `Received with sincere thanks from ${
                        receipt.full_name || receipt.donor_name || "-"
                    } towards the charitable and educational activities of Vidya Jyothi Foundation. This receipt has been generated electronically and is valid without a physical signature.`,
                    marginX + 10,
                    y + 8,
                    {
                        width: contentWidth - 20,
                        align: "justify",
                    }
                );

            doc.fillColor("#000000");

            y += declarationH;

            /* ==========================================================
               FOOTER: QR + SIGNATURE
            ========================================================== */

            y += 18;

            // QR box
            const qrBoxSize = 95;

            doc
                .rect(marginX, y, qrBoxSize, qrBoxSize)
                .strokeColor("#000000")
                .lineWidth(0.7)
                .stroke();

            doc.image(qrImage, marginX + 8, y + 8, { width: qrBoxSize - 16 });

            doc
                .font("Helvetica-Bold")
                .fontSize(8.5)
                .fillColor("#000000")
                .text("Scan to Verify Receipt", marginX, y + qrBoxSize + 4, {
                    width: qrBoxSize,
                    align: "center",
                });

            doc
                .font("Helvetica")
                .fontSize(7)
                .fillColor("#6B7280")
                .text(receipt.receipt_code, marginX, y + qrBoxSize + 16, {
                    width: qrBoxSize,
                    align: "center",
                });

            doc.fillColor("#000000");

            // Signature block (right side, roughly aligned with QR box)
            const sigLineW = 170;
            const sigLineX = marginX + contentWidth - sigLineW;
            const sigLineY = y + 40;

            doc
                .moveTo(sigLineX, sigLineY)
                .lineTo(sigLineX + sigLineW, sigLineY)
                .strokeColor("#374151")
                .lineWidth(1)
                .stroke();

            doc
                .font("Helvetica-Bold")
                .fontSize(9)
                .text("Authorized Signatory", sigLineX, sigLineY + 4, {
                    width: sigLineW,
                    align: "right",
                });

            doc
                .font("Helvetica")
                .fontSize(8)
                .text("Vidya Jyothi Foundation", sigLineX, sigLineY + 16, {
                    width: sigLineW,
                    align: "right",
                });

            doc
                .font("Helvetica")
                .fontSize(7)
                .fillColor("#6B7280")
                .text("This is a computer-generated receipt.", sigLineX, sigLineY + 28, {
                    width: sigLineW,
                    align: "right",
                });

            doc.fillColor("#000000");

            /* ==========================================================
               BOTTOM FOOTER (fixed near the bottom of the page)
            ========================================================== */

            doc
                .fontSize(8)
                .fillColor("#6B7280")
                .font("Helvetica")
                .text(
                    "Vidya Jyothi Foundation  |  Guntur, Andhra Pradesh",
                    marginX,
                    770,
                    { width: contentWidth, align: "center" }
                )
                .text(
                    "support@vidyajyothifoundation.org  |  +91 XXXXX XXXXX",
                    marginX,
                    782,
                    { width: contentWidth, align: "center" }
                )
                .text(
                    `Generated On : ${new Date().toLocaleString("en-IN")}`,
                    marginX,
                    794,
                    { width: contentWidth, align: "center" }
                );

            doc.end();

            stream.on("finish", () => {
                resolve({
                    filePath: pdfPath,
                    fileName,
                });
            });

            stream.on("error", reject);

        } catch (error) {

            reject(error);

        }

    });

}

module.exports = {
    generateReceiptPDF,
};