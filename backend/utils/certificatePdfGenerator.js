const PDFDocument = require("pdfkit");
const QRCode = require("qrcode");
const fs = require("fs");
const path = require("path");

/*
|--------------------------------------------------------------------------
| Generate Donation Certificate PDF
|--------------------------------------------------------------------------
| Single-page A4 landscape certificate. Forest green + gold palette, a
| dashed seal medallion as the signature flourish, serif titles
| (Times-Bold — a built-in PDFKit font, no embedding needed), and
| monospace (Courier) for reference codes.
|
| Layout is laid out on a fixed vertical grid tuned to fit entirely
| within one A4-landscape page (841.89 x 595.28pt) with a small margin,
| so nothing overflows onto an accidental second page.
|--------------------------------------------------------------------------
*/

async function generateCertificatePDF(certificate) {

    /*
    |--------------------------------------------------------------------------
    | Output Folder / File
    |--------------------------------------------------------------------------
    */

    const outputFolder = path.join(__dirname, "../temp/certificates");

    if (!fs.existsSync(outputFolder)) {
        fs.mkdirSync(outputFolder, { recursive: true });
    }

    const fileName = `${certificate.certificate_code}.pdf`;
    const filePath = path.join(outputFolder, fileName);

    /*
    |--------------------------------------------------------------------------
    | Helpers
    |--------------------------------------------------------------------------
    */

    const formatDate = (date) =>
        date
            ? new Date(date).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
              })
            : "-";

    const titleForType = (type) => {
        if (type === "SPONSOR") return "SPONSOR CERTIFICATE";
        if (type === "CSR") return "CSR CERTIFICATE";
        return "CERTIFICATE OF APPRECIATION";
    };

    const monogramForType = (type) => {
        if (type === "SPONSOR") return "S";
        if (type === "CSR") return "C";
        return "VJF";
    };

    /*
    |--------------------------------------------------------------------------
    | QR Code (async — generated before the synchronous PDFKit drawing below)
    |--------------------------------------------------------------------------
    */

    const verificationUrl =
        `${process.env.FRONTEND_URL || ""}/verify-certificate/${certificate.certificate_code}`;

    const qrImage = await QRCode.toDataURL(verificationUrl, {
        margin: 1,
        width: 200,
        color: { dark: "#1B2A22", light: "#FFFFFF" },
    });

    /*
    |--------------------------------------------------------------------------
    | Build & Write PDF
    |--------------------------------------------------------------------------
    */

    return new Promise((resolve, reject) => {

        try {

            // Small margin — the default 72pt margin is what was pushing the
            // footer past the page boundary and forcing a phantom 2nd page.
            const doc = new PDFDocument({
                size: "A4",
                layout: "landscape",
                margin: 20,
                autoFirstPage: true,
            });

            const stream = fs.createWriteStream(filePath);
            doc.pipe(stream);

            const pageWidth = doc.page.width;   // ~841.89
            const pageHeight = doc.page.height; // ~595.28
            const center = pageWidth / 2;

            /* ---------------- Palette ---------------- */

            const FOREST = "#0E6E4E";
            const GOLD = "#B8863C";
            const INK = "#1B2A22";
            const MUTED = "#5B6B62";
            const PAPER = "#FFFDF9";
            const HAIRLINE = "#E2E4DE";
            const PANEL = "#F6F5F1";

            /* ==========================================================
               Vertical Grid — every block below is placed against these
               fixed Y values so the whole certificate is guaranteed to
               fit inside one page (inner border bottom sits at ~567).
            ========================================================== */

            const Y = {
                brandTitle: 42,
                brandSub: 74,
                sealCenter: 108,
                certTitle: 148,
                divider: 182,
                presentedTo: 198,
                name: 220,
                noteLine1: 260,
                noteLine2: 276,
                panelTop: 300,
                panelHeight: 84,
                appreciateLine1: 400,
                appreciateLine2: 416,
                rowTop: 442,       // QR + signature row
                qrSize: 62,
                footerLine: 542,
                footerText: 550,
            };

            /* ==========================================================
               Background
            ========================================================== */

            doc.rect(0, 0, pageWidth, pageHeight).fill(PAPER);

            /* ==========================================================
               Ornamented Double Border
            ========================================================== */

            doc
                .lineWidth(3)
                .strokeColor(GOLD)
                .roundedRect(18, 18, pageWidth - 36, pageHeight - 36, 6)
                .stroke();

            doc
                .lineWidth(0.75)
                .strokeColor(HAIRLINE)
                .roundedRect(28, 28, pageWidth - 56, pageHeight - 56, 4)
                .stroke();

            // Corner flourishes — small quarter-arc + dot at each inner corner
            const corners = [
                { x: 28, y: 28, dx: 1, dy: 1 },
                { x: pageWidth - 28, y: 28, dx: -1, dy: 1 },
                { x: 28, y: pageHeight - 28, dx: 1, dy: -1 },
                { x: pageWidth - 28, y: pageHeight - 28, dx: -1, dy: -1 },
            ];

            corners.forEach(({ x, y, dx, dy }) => {
                doc
                    .lineWidth(1.5)
                    .strokeColor(GOLD)
                    .moveTo(x + dx * 26, y)
                    .lineTo(x + dx * 10, y)
                    .lineTo(x + dx * 10, y + dy * 26)
                    .stroke();

                doc.circle(x + dx * 10, y + dy * 10, 2.5).fill(GOLD);
            });

            /* ==========================================================
               Header
            ========================================================== */

            doc
                .font("Times-Bold")
                .fontSize(24)
                .fillColor(FOREST)
                .text("VIDYA JYOTHI FOUNDATION", 0, Y.brandTitle, { align: "center" });

            doc
                .font("Helvetica")
                .fontSize(9.5)
                .fillColor(MUTED)
                .text("Guntur, Andhra Pradesh  \u2022  www.vidyajyothifoundation.org", 0, Y.brandSub, {
                    align: "center",
                });

            /* ==========================================================
               Seal Medallion (signature flourish)
            ========================================================== */

            const sealX = center;
            const sealY = Y.sealCenter;
            const sealR = 22;

            doc
                .lineWidth(1.2)
                .dash(2, { space: 2 })
                .strokeColor(GOLD)
                .circle(sealX, sealY, sealR)
                .stroke()
                .undash();

            doc
                .lineWidth(1.5)
                .strokeColor(GOLD)
                .circle(sealX, sealY, sealR - 5)
                .stroke();

            doc
                .font("Times-Bold")
                .fontSize(14)
                .fillColor(GOLD)
                .text(monogramForType(certificate.certificate_type), sealX - sealR, sealY - 7, {
                    width: sealR * 2,
                    align: "center",
                });

            // Ribbon tails beneath the seal — kept short so they never
            // reach the certificate title below.
            doc.polygon(
                [sealX - 8, sealY + sealR - 3],
                [sealX - 2, sealY + sealR + 14],
                [sealX - 11, sealY + sealR + 10]
            ).fill(GOLD);

            doc.polygon(
                [sealX + 8, sealY + sealR - 3],
                [sealX + 2, sealY + sealR + 14],
                [sealX + 11, sealY + sealR + 10]
            ).fill(FOREST);

            /* ==========================================================
               Certificate Title
            ========================================================== */

            doc
                .font("Times-Bold")
                .fontSize(21)
                .fillColor(GOLD)
                .text(titleForType(certificate.certificate_type), 0, Y.certTitle, {
                    align: "center",
                    characterSpacing: 1.5,
                });

            // Decorative rule with a small diamond at center
            doc
                .lineWidth(1.5)
                .strokeColor(GOLD)
                .moveTo(160, Y.divider)
                .lineTo(center - 8, Y.divider)
                .stroke();

            doc
                .lineWidth(1.5)
                .strokeColor(GOLD)
                .moveTo(center + 8, Y.divider)
                .lineTo(pageWidth - 160, Y.divider)
                .stroke();

            doc.save();
            doc.translate(center, Y.divider).rotate(45);
            doc.rect(-3.5, -3.5, 7, 7).fill(GOLD);
            doc.restore();

            /* ==========================================================
               Presented To
            ========================================================== */

            doc
                .font("Helvetica")
                .fontSize(12.5)
                .fillColor(INK)
                .text("This Certificate is proudly presented to", 0, Y.presentedTo, {
                    align: "center",
                });

            doc
                .font("Times-Bold")
                .fontSize(26)
                .fillColor(FOREST)
                .text(certificate.full_name || "-", 0, Y.name, { align: "center" });

            doc
                .font("Helvetica")
                .fontSize(11.5)
                .fillColor(MUTED)
                .text(
                    "In recognition of the generous contribution towards supporting education",
                    0,
                    Y.noteLine1,
                    { align: "center" }
                );

            doc.text("and empowering deserving students.", 0, Y.noteLine2, { align: "center" });

            /* ==========================================================
               Donation Information Panel
            ========================================================== */

            const boxY = Y.panelTop;
            const boxX = 100;
            const boxW = pageWidth - 200;
            const boxH = Y.panelHeight;

            // soft drop-shadow effect (offset panel behind)
            doc.roundedRect(boxX + 3, boxY + 3, boxW, boxH, 8).fill("#EDEAE1");

            doc
                .roundedRect(boxX, boxY, boxW, boxH, 8)
                .fillAndStroke(PANEL, HAIRLINE);

            // accent bar
            doc.roundedRect(boxX, boxY, 5, boxH, 2).fill(FOREST);

            // vertical divider between the two columns
            doc
                .lineWidth(0.75)
                .strokeColor(HAIRLINE)
                .moveTo(boxX + boxW / 2, boxY + 12)
                .lineTo(boxX + boxW / 2, boxY + boxH - 12)
                .stroke();

            const leftX = boxX + 26;
            const rightX = boxX + boxW / 2 + 26;
            const colW = boxW / 2 - 40;

            doc
                .font("Helvetica-Bold")
                .fontSize(10)
                .fillColor(MUTED)
                .text("DONATION AMOUNT", leftX, boxY + 12, { characterSpacing: 0.5 });

            doc
                .font("Times-Bold")
                .fontSize(20)
                .fillColor(FOREST)
                .text(
                    `\u20B9 ${Number(certificate.amount || 0).toLocaleString("en-IN")}`,
                    leftX,
                    boxY + 28
                );

            doc
                .font("Helvetica")
                .fontSize(10.5)
                .fillColor(INK)
                .text(`Donation Type : ${certificate.donation_type || "-"}`, leftX, boxY + 62, {
                    width: colW,
                });

            doc
                .font("Courier")
                .fontSize(9.5)
                .fillColor(INK)
                .text(`Certificate No : ${certificate.certificate_code}`, rightX, boxY + 12, {
                    width: colW,
                });

            doc.text(`Receipt No     : ${certificate.receipt_code || "-"}`, rightX, boxY + 29, {
                width: colW,
            });

            doc
                .font("Helvetica")
                .fontSize(9.5)
                .fillColor(INK)
                .text(`Financial Year : ${certificate.financial_year || "-"}`, rightX, boxY + 46, {
                    width: colW,
                });

            doc.text(`Issue Date : ${formatDate(certificate.issue_date)}`, rightX, boxY + 63, {
                width: colW,
            });

            /* ==========================================================
               Appreciation Message
            ========================================================== */

            doc
                .font("Helvetica-Oblique")
                .fontSize(10.5)
                .fillColor(MUTED)
                .text(
                    "Your generous support helps us provide scholarships, educational resources, and opportunities",
                    70,
                    Y.appreciateLine1,
                    { align: "center", width: pageWidth - 140 }
                );

            doc.text(
                "to deserving students. We sincerely appreciate your valuable contribution.",
                70,
                Y.appreciateLine2,
                { align: "center", width: pageWidth - 140 }
            );

            /* ==========================================================
               QR Verification (left) + Authorized Signature (right)
               — placed on the same row so the page never grows taller.
            ========================================================== */

            const qrX = 100;
            const qrY = Y.rowTop;
            const qrSize = Y.qrSize;

            doc
                .roundedRect(qrX - 8, qrY - 8, qrSize + 16, qrSize + 16, 6)
                .fillAndStroke("#FFFFFF", HAIRLINE);

            doc.image(qrImage, qrX, qrY, { width: qrSize, height: qrSize });

            doc
                .font("Courier")
                .fontSize(8)
                .fillColor(MUTED)
                .text("SCAN TO VERIFY", qrX - 8, qrY + qrSize + 14, {
                    width: qrSize + 16,
                    align: "center",
                    characterSpacing: 0.5,
                });

            const signW = 170;
            const signX = pageWidth - 120 - signW;
            const signLineY = qrY + qrSize / 2 - 6;

            doc
                .lineWidth(1)
                .strokeColor(MUTED)
                .moveTo(signX, signLineY)
                .lineTo(signX + signW, signLineY)
                .stroke();

            doc.circle(signX + signW + 14, signLineY - 4, 3).fill(GOLD);

            doc
                .font("Times-Bold")
                .fontSize(11.5)
                .fillColor(FOREST)
                .text("Authorized Signatory", signX, signLineY + 8, {
                    width: signW,
                    align: "center",
                });

            doc
                .font("Helvetica")
                .fontSize(9)
                .fillColor(MUTED)
                .text("Vidya Jyothi Foundation", signX, signLineY + 24, {
                    width: signW,
                    align: "center",
                });

            /* ==========================================================
               Footer
            ========================================================== */

            doc
                .lineWidth(0.75)
                .strokeColor(HAIRLINE)
                .moveTo(60, Y.footerLine)
                .lineTo(pageWidth - 60, Y.footerLine)
                .stroke();

            doc
                .font("Helvetica")
                .fontSize(8)
                .fillColor(MUTED)
                .text(
                    "This certificate is electronically generated by Vidya Jyothi Foundation and is valid without a physical signature.",
                    0,
                    Y.footerText,
                    { align: "center", width: pageWidth }
                );

            doc.end();

            stream.on("finish", () => {
                resolve({
                    success: true,
                    filePath,
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
    generateCertificatePDF,
};