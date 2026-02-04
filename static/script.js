document.addEventListener("DOMContentLoaded", () => {

  let step = 1;
  const data = {};

  const steps = document.querySelectorAll(".step-content");
  const stepIndicators = document.querySelectorAll(".step");

  function showStep(n) {
    steps.forEach(s => s.classList.remove("active"));
    stepIndicators.forEach(s => s.classList.remove("active"));

    document.getElementById(`step${n}`).classList.add("active");
    stepIndicators[n - 1].classList.add("active");

    step = n;
  }


  steps.forEach(s => s.classList.remove("active"));
  stepIndicators.forEach(s => s.classList.remove("active"));
  document.getElementById("bookingId").innerText = "";
  showStep(1);


  document.querySelectorAll(".option").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".option").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");

      data.service = btn.innerText.trim();
      document.querySelector("#step1 .next-btn").disabled = false;
    });
  });

  document.querySelector("#step1 .next-btn").onclick = () => showStep(2);


  const dateInput = document.getElementById("date");

  document.querySelectorAll(".slot").forEach(slot => {
    if (!slot.classList.contains("booked")) {
      slot.addEventListener("click", () => {
        document.querySelectorAll(".slot").forEach(s => s.classList.remove("selected"));
        slot.classList.add("selected");

        data.time = slot.innerText.trim();
        data.date = dateInput.value;

        document.querySelector("#step2 .next-btn").disabled = true;
        if (data.date) {
          document.querySelector("#step2 .next-btn").disabled = false;
        }
      });
    }
  });

  document.querySelector("#step2 .next-btn").onclick = () => showStep(3);


  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const mobileInput = document.getElementById("mobile");

  function validateForm() {
    const emailOk = /\S+@\S+\.\S+/.test(emailInput.value);
    const mobileOk = /^[6-9]\d{9}$/.test(mobileInput.value);
    const nameOk = nameInput.value.trim().length > 2;

    document.querySelector("#step3 .next-btn").disabled = !(emailOk && mobileOk && nameOk);
  }

  [nameInput, emailInput, mobileInput].forEach(el =>
    el.addEventListener("input", validateForm)
  );

  document.querySelector("#step3 .next-btn").onclick = () => {
  data.name = nameInput.value.trim();
  data.email = emailInput.value.trim();
  data.mobile = mobileInput.value.trim();

  document.getElementById("summary").innerHTML = `
    <div class="summary-item">
      <span class="label">Service</span>
      <span class="value">${data.service}</span>
    </div>
    <div class="summary-item">
      <span class="label">Date</span>
      <span class="value">${data.date}</span>
    </div>
    <div class="summary-item">
      <span class="label">Time</span>
      <span class="value">${data.time}</span>
    </div>
    <div class="summary-item">
      <span class="label">Name</span>
      <span class="value">${data.name}</span>
    </div>
  `;

  showStep(4);
};



  document.querySelector("#step4 .next-btn").onclick = async () => {
    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const result = await res.json();

      if (!result.booking_id) {
        alert("Booking failed. Try again.");
        return;
      }

      document.getElementById("bookingId").innerText =
        `Booking ID: ${result.booking_id}`;

      showStep(5);

    } catch (err) {
      console.error(err);
      alert("Server error. Please try later.");
    }
  };

});
