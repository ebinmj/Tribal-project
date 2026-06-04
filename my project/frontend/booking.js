const form = document.getElementById("bookingForm");
const statusText = document.getElementById("status");

form.addEventListener("submit", async (e) => {


e.preventDefault();

const data = {
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim(),
    date: document.getElementById("date").value,
    time: document.getElementById("time").value,
    reason: document.getElementById("reason").value.trim()
};

try {

    statusText.style.color = "#ffffff";
    statusText.textContent = "Sending booking request...";

    const res = await fetch(
        "https://tribal-project.onrender.com/api/booking",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }
    );

    const result = await res.json();

localStorage.setItem("bookingId", result.bookingId);
    if (!res.ok) {
        throw new Error(
            result.error ||
            result.message ||
            "Booking failed"
        );
    }

    statusText.style.color = "#66ff99";
    statusText.textContent =
    "✅ Booking request sent successfully.";

setTimeout(() => {
    window.location.href = "dashboard-user.html";
}, 1500);

} catch (err) {

    console.error(err);

    statusText.style.color = "#ff7675";
    statusText.textContent =
        "❌ " + err.message;
}


});
async function checkBookingStatus() {

    const bookingId = localStorage.getItem("bookingId");

    if (!bookingId) return;

    try {

        const res = await fetch(
            `https://tribal-project.onrender.com/api/booking/${bookingId}`
        );

        const data = await res.json();

        const box = document.getElementById("approvalStatus");

        if (box) {

            if (data.status === "accepted") {
                box.style.color = "#66ff99";
            }
            else if (data.status === "rejected") {
                box.style.color = "#ff7675";
            }
            else {
                box.style.color = "#ffffff";
            }

            box.innerHTML =
            `Current Status: <b>${data.status.toUpperCase()}</b>`;
        }

    } catch (err) {

        console.error(err);

    }
}
checkBookingStatus();

setInterval(checkBookingStatus, 5000);
