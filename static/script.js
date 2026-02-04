let step = 1;
const data = {};

// cache DOM once (BEST PRACTICE)
const steps = document.querySelectorAll(".step-content");
const stepIndicators = document.querySelectorAll(".step");

function showStep(n) {
  steps.forEach(s => s.classList.remove("active"));
  stepIndicators.forEach(s => s.classList.remove("active"));

  document.getElementById(`step${n}`)?.classList.add("active");
  stepIndicators[n - 1]?.classList.add("active");

  step = n;
}

/* ---------- STEP 1 ---------- */
document.querySelectorAll(".option").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".option").forEach(b => b.classList.remove("selected"));
    btn.classList.add("selected");

    data.service = btn.innerText;
    document.querySelector("#step1 .next-btn").disabled = false;
  });
});

document.querySelector("#step1 .next-btn").onclick = () => showStep(2);

/* ---------- STEP 2 ---------- */
const dateInput = document.getElementById("date");

document.querySelectorAll(".slot").forEach(slot => {
  if (!slot.classList.contains("booked")) {
    slot.addEventListener("click", () => {
      document.querySelectorAll(".slot").forEach(s => s.classList.remove("selected"));
      slot.classList.add("selected");

      data.time = slot.innerText;
      data.date = dateInput.value;

      document.querySelector("#step2 .next-btn").disabled = false;
    });
  }
});

document.querySelector("#step2 .next-btn").onclick = () => showStep(3);

/* ---------- STEP 3 ---------- */
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const mobileInput = document.getElementById("mobile");

function validateForm() {
  const emailOk = /\S+@\S+\.\S+/.test(emailInput.value);
  const mobileOk = /^[6-9]\d{9}$/.test(mobileInput.value);
  const nameOk = nameInput.value.length > 2;

  document.querySelector("#step3 .next-btn").disabled = !(emailOk && mobileOk && nameOk);
}

[nameInput, emailInput, mobileInput].forEach(el =>
  el.addEventListener("input", validateForm)
);

document.querySelector("#step3 .next-btn").onclick = () => {
  data.name = nameInput.value;
  data.email = emailInput.value;
  data.mobile = mobileInput.value;

  document.getElementById("summary").innerHTML = `
    <b>Service:</b> ${data.service}<br>
    <b>Date:</b> ${data.date}<br>
    <b>Time:</b> ${data.time}<br>
    <b>Name:</b> ${data.name}
  `;

  showStep(4);
};

/* ---------- CONFIRM ---------- */
document.querySelector("#step4 .next-btn").onclick = async () => {
  const res = await fetch("/api/book", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  const result = await res.json();
  document.getElementById("bookingId").innerText =
    `Booking ID: ${result.booking_id}`;

  showStep(5);
};
