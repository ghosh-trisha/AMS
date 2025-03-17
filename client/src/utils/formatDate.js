export default function formatTime(dateString) {
    const date = new Date(dateString);
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0'); // Ensures two digits
    return `${hours}:${minutes}`;
}