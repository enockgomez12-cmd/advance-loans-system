const money = value =>
  "KES " + Number(value).toLocaleString("en-KE", {
    maximumFractionDigits: 2
  });

const range = document.getElementById("heroRange");

range.addEventListener("input", function() {
  document.getElementById("heroAmount").textContent =
    money(this.value);
});

function calculate() {
  const amount = Number(document.getElementById("loanAmount").value);
  const rate = Number(document.getElementById("interest").value);
  const months = Number(document.getElementById("period").value);

  if (!Number.isFinite(amount) || amount < 1000 ||
      amount > 50000 || !Number.isFinite(rate) ||
      rate < 0 || rate > 100) {
    alert("Enter valid sample figures.");
    return;
  }

  const interest = amount * rate / 100;
  const total = amount + interest;
  const monthly = total / months;

  document.getElementById("principal").textContent = money(amount);
  document.getElementById("interestResult").textContent = money(interest);
  document.getElementById("total").textContent = money(total);
  document.getElementById("monthly").textContent = money(monthly);
}

calculate();

document.getElementById("applicationForm")
.addEventListener("submit", function(event) {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const amount = Number(document.getElementById("requestedAmount").value);

  if (!name || !Number.isFinite(amount) ||
      amount < 1000 || amount > 50000) {
    alert("Please enter valid demonstration details.");
    return;
  }

  document.getElementById("message").textContent =
    "Thank you, " + name +
    ". Your demo application was completed successfully. " +
    "No actual loan application was submitted.";

  this.reset();
});