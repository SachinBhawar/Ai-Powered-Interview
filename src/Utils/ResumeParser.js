// utils/resumeUtils.js
import { GlobalWorkerOptions, getDocument } from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker?url";
import * as mammoth from "mammoth";

// Configure PDF.js worker
GlobalWorkerOptions.workerSrc = pdfjsWorker;

// Extract text from PDF
const handlePdf = async (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = async () => {
            try {
                const typedArray = new Uint8Array(reader.result);
                const pdf = await getDocument(typedArray).promise;
                let textContent = "";

                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const text = await page.getTextContent();
                    text.items.forEach((item) => {
                        textContent += item.str + " ";
                    });
                }

                resolve(textContent);
            } catch (error) {
                reject(error);
            }
        };

        reader.onerror = () => reject(new Error("Failed to read PDF file"));
        reader.readAsArrayBuffer(file);
    });
};

// Extract text from DOCX/DOC
const handleDocx = async (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = async (event) => {
            try {
                const arrayBuffer = event.target.result;
                const { value: textContent } = await mammoth.extractRawText({ arrayBuffer });
                resolve(textContent);
            } catch (error) {
                reject(error);
            }
        };

        reader.onerror = () => reject(new Error("Failed to read DOCX/DOC file"));
        reader.readAsArrayBuffer(file);
    });
};

// Process file (PDF or DOCX)
const processFile = async (file) => {
    if (!file) throw new Error("No file provided");

    const ext = file.name.split(".").pop().toLowerCase();

    switch (ext) {
        case "pdf":
            return await handlePdf(file);
        case "docx":
            return await handleDocx(file);
        default:
            throw new Error("Please upload a PDF or Word (.doc/.docx) file.");
    }
};

// Extract details (Name, Email, Mobile)
export const extractResumeDetailsFromFile = async (file, nameWordCount = 3) => {
    const text = await processFile(file);

    const txt = String(text || "")
        .replace(/[\u2022\u25E6\u2023\u2043\u2219⋄•·|•—]/g, " ")
        .trim();

    const emailRe = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
    const phoneRe = /(?:(?:\+?\d{1,3}[\s-]?)?(?:\d{10}|\d{3}[\s-]?\d{3}[\s-]?\d{4}))/;

    const emailExec = emailRe.exec(txt);
    const phoneExec = phoneRe.exec(txt);

    const extractedEmail = emailExec?.[0] ?? "";
    const extractedPhone = phoneExec?.[0] ?? "";

    const emailIndex = typeof emailExec?.index === "number" ? emailExec.index : -1;
    const phoneIndex = typeof phoneExec?.index === "number" ? phoneExec.index : -1;

    const anchorIndex =
        (emailIndex >= 0 && phoneIndex >= 0 && Math.min(emailIndex, phoneIndex)) ||
        (emailIndex >= 0 && emailIndex) ||
        (phoneIndex >= 0 && phoneIndex) ||
        txt.length;

    const beforeAnchor = txt.slice(0, anchorIndex).trim();

    const cleanedBefore = beforeAnchor
        .replace(/[^A-Za-z\s.'-]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

    const tokens = cleanedBefore.split(/\s+/).filter(Boolean);

    const nameTokenPattern = /^[A-Za-z][A-Za-z.'-]*$/;
    const nameCandidates = tokens.filter((t) => nameTokenPattern.test(t));

    let extractedName = nameCandidates.slice(0, nameWordCount).join(" ");

    if (!extractedName) {
        const fallbackTokens = txt
            .replace(/[^A-Za-z\s.'-]/g, " ")
            .split(/\s+/)
            .filter((t) => nameTokenPattern.test(t))
            .slice(0, nameWordCount);
        extractedName = fallbackTokens.join(" ");
    }

    const toTitleCase = (s) =>
        s
            .split(" ")
            .map((w) => (w ? w[0].toUpperCase() + w.slice(1).toLowerCase() : ""))
            .join(" ");

    if (extractedName) extractedName = toTitleCase(extractedName);

    return {
        name: extractedName || "",
        email: extractedEmail || "",
        phone: extractedPhone || "",
        role: "",
    };
};
