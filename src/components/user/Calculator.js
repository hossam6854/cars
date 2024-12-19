import React, { useState, useEffect } from "react";
import "./css/InstallmentCalculator.css"; 


const InstallmentCalculator = ({ price, condition }) => {
  const [downPayment, setDownPayment] = useState("");
  const [duration, setDuration] = useState("");
  const [income, setIncome] = useState("");
  const [interestRate, setInterestRate] = useState(0);
  const [monthlyInstallment, setMonthlyInstallment] = useState(null);
  const [totalPaid, setTotalPaid] = useState(null);
  const [totalInterest, setTotalInterest] = useState(null);
  const [affordability, setAffordability] = useState(null);
  const [offerMessage, setOfferMessage] = useState("");



  useEffect(() => {
    setInterestRate(condition === "Used" ? 18 : 17);
  }, [condition]);

  const calculateInstallment = () => {
    const loanAmount = parseFloat(price) - parseFloat(downPayment);
    const months = parseInt(duration, 10);
    const monthlyInterestRate = parseFloat(interestRate) / 12 / 100;

    if (loanAmount > 0 && months > 0 && monthlyInterestRate >= 0) {
      const installment =
        loanAmount *
        (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, months)) /
        (Math.pow(1 + monthlyInterestRate, months) - 1);

      const total = installment * months;
      const totalInterest = total - loanAmount;

      setMonthlyInstallment(installment.toFixed(2));
      setTotalPaid(total.toFixed(2));
      setTotalInterest(totalInterest.toFixed(2));

      const affordability = ((installment / income) * 100).toFixed(2);
      setAffordability(affordability);

      if (downPayment / price > 0.5) {
        setOfferMessage("Special offer: Free first-year insurance!");
      } else {
        setOfferMessage("");
      }


    } else {
      alert("Please enter valid values.");
    }
  };




  return (
    <div className="installment-calculator">
        <h1 className="title">🚗 Advanced Car Installment Calculator</h1>
        <div className="form-group">
        <label>Car Price: {price} EGP</label>
      </div>
      <div className="form-group">
        <label>Down Payment:</label>
        <input
          type="number"
          value={downPayment}
          onChange={(e) => setDownPayment(e.target.value)}
          placeholder="Enter down payment"
        />
      </div>
      <div className="form-group">
        <label>Duration (months):</label>
        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          placeholder="Enter duration in months"
        />
      </div>
      <div className="form-group">
        <label>Monthly Income (EGP):</label>
        <input
          type="number"
          value={income}
          onChange={(e) => setIncome(e.target.value)}
          placeholder="Enter your monthly income"
        />
      </div>
      <div className="form-group">
        <label>Annual Interest Rate: {interestRate}%</label>
      </div>
      <button onClick={calculateInstallment} className="calculate-button">
          🚀 Calculate
        </button>
      {monthlyInstallment && (
        <div className="result">
          <p>
            Monthly Installment: <strong>{monthlyInstallment} EGP</strong>
          </p>
          <p>
            Total Paid: <strong>{totalPaid} EGP</strong>
          </p>
          <p>
            Total Interest Paid: <strong>{totalInterest} EGP</strong>
          </p>
          <p>
            Installment as % of Income:{" "}
            <strong>{affordability}%</strong>
          </p>
          {offerMessage && <p style={{ color: "green" }}>{offerMessage}</p>}
        </div>
      )}

     
      <div className="affordability-indicator">
        <h4>Affordability Indicator:</h4>
        <div
          style={{
            width: "100%",
            height: "10px",
            background:
              affordability <= 40
                ? "green"
                : affordability <= 60
                ? "yellow"
                : "red",
          }}
        ></div>
        <p>{affordability}% of your income</p>
      </div>
    </div>
  );
};

export default InstallmentCalculator;
