const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/api/cars/:id/similar", async (req, res) => {
  const { id } = req.params;
  const { criteria, condition } = req.query;

  try {
    const [currentCarResult] = await db.query("SELECT * FROM cars WHERE id = ?", [id]);
    if (currentCarResult.length === 0) {
      return res.status(404).send(`Car with ID ${id} not found.`);
    }
    const currentCar = currentCarResult[0];

    const allowedCriteria = ["price", "car_type", "fuel_type", "mileage"];
    const criteriaList = criteria ? criteria.split(",") : [];
    for (const criterion of criteriaList) {
      if (!allowedCriteria.includes(criterion)) {
        return res.status(400).send(`Invalid comparison criteria: ${criterion}`);
      }
    }

    let conditionFilter = "";
    if (condition === "New") {
      conditionFilter = "AND car_condition = 'New'";
    } else if (condition === "Used") {
      conditionFilter = "AND car_condition = 'Used'";
    }

    const comparisonClauses = criteriaList
      .map((criterion) => `ABS(${criterion} - ?)`)
      .join(" + ");
    const query = `
      SELECT *, (${comparisonClauses}) AS comparison_score
      FROM cars
      WHERE id != ?
      ${conditionFilter}
      ORDER BY comparison_score ASC
      LIMIT 5;
    `;
    const comparisonValues = criteriaList.map((criterion) => currentCar[criterion]);
    const [similarCars] = await db.query(query, [...comparisonValues, id]);

    res.json(similarCars);
  } catch (err) {
    console.error("Error fetching similar cars:", err.message);
    res.status(500).send(`Error fetching similar cars: ${err.message}`);
  }
});

module.exports = router;





