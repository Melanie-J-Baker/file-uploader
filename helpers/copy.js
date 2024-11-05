export default function copyToClipboard() {
    const url = document.getElementById("fileUrl").innerText;
    navigator.clipboard.writeText(url).then(() => {
        alert("File URL copied to clipboard");
    }).catch((err) => {
        console.error("Error copying to clipboard: ", err);
    });
}