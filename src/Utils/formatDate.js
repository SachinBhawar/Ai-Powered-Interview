export default function formatToIST(isoString) {
    const date = new Date(isoString);

    return date.toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "2-digit",
        month: "short", // "Jan", "Feb", "Mar"...
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true, // 12-hour format with AM/PM
    });
}
