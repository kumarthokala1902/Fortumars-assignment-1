document.addEventListener("DOMContentLoaded", () => {

let step = 1;
const data = {};

const showStep = (n) => {
  document.querySelectorAll(".step-content").forEach(s => s.classList.remove("active"));
  document.querySelectorAll(".step").forEach(s => s.classList.remove("active"));
  document.getElementById(`step${n}`).classList.add("active");
  document.querySelectorAll(".step")[n-1].classList.add("active");
  step = n;
};

/* STEP 1 */
document.querySelectorAll(".option").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".option").forEach(b => b.classList.remove("selected"));
    btn.classList.add("selected");
    data.service = btn.innerText;
    document.querySelector("#step1 .next-btn").disabled = false;
  };
});
document.querySelector("#step1 .next-btn").onclick = () => showStep(2);

/* STEP 2 */
const dateInput = document.getElementById("date");
document.querySelectorAll(".slot:not(.booked)").forEach(slot => {
  slot.onclick = () => {
    document.querySelectorAll(".slot").forEach(s => s.classList.remove("selected"));
    slot.classList.add("selected");
    data.time = slot.innerText;
    data.date = dateInput.value;
    document.querySelector("#step2 .next-btn").disabled = false;
  };
});
document.querySelector("#step2 .next-btn").onclick = () => showStep(3);

/* STEP 3 */
const name = document.getElementById("name");
const email = document.getElementById("email");
const mobile = document.getElementById("mobile");

const validate = () => {
  const ok =
    name.value.length > 2 &&
    /\S+@\S+\.\S+/.test(email.value) &&
    /^[6-9]\d{9}$/.test(mobile.value);
  document.querySelector("#step3 .next-btn").disabled = !ok;
};

[name, email, mobile].forEach(i => i.oninput = validate);

document.querySelector("#step3 .next-btn").onclick = () => {
  data.name = name.value;
  data.email = email.value;
  data.mobile = mobile.value;

  document.getElementById("summary").innerHTML = `
    <b>Service:</b> ${data.service}<br>
    <b>Date:</b> ${data.date}<br>
    <b>Time:</b> ${data.time}<br>
    <b>Name:</b> ${data.name}
  `;
  showStep(4);
};

/* CONFIRM */
document.querySelector("#step4 .next-btn").onclick = async () => {
  const res = await fetch("/api/book", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(data)
  });
  const result = await res.json();
  document.getElementById("bookingId").innerText =
    `Booking ID: ${result.booking_id}`;
  showStep(5);
};

});
