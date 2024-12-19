  const express = require("express");
  const bodyParser = require("body-parser");
  const multer = require("multer");
  const cors = require("cors");
  const path = require("path");
  const fs = require("fs");
  const jwt = require('jsonwebtoken');
  const bcrypt = require('bcrypt');
  const carRoutes = require("./routes/cars"); // Path to the cars routes file



  const db = require('./db'); // Import the database module


  const app = express();
  const PORT = 5000;  

  // Middleware
  app.use(cors());
  app.use(carRoutes);
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use("/uploads", express.static(path.join(__dirname, "uploads")));

  app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true,  
  }));
  








// sign up 
app.post("/signup", async (req, res) => {
  const { username, email, password, role = "user" } = req.body;

  if (role !== "user" && role !== "admin") {
    return res.status(400).json({ error: 'Invalid role. Must be "user" or "admin".' });
  }

  try {
    const [results] = await db.query("SELECT * FROM users WHERE username = ? OR email = ?", [username, email]);

    if (results.length > 0) {
      return res.status(400).json({ error: "Username or email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query(
      "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
      [username, email, hashedPassword, role]
    );
    

    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    console.error("Error during signup:", err);
    res.status(500).send("Internal server error.");
  }
});




// Login endpoint
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required." });
  }

  const userQuery = "SELECT * FROM users WHERE username = ?";
  try {
    const [results] = await db.query(userQuery, [username]);

    if (results.length === 0) {
      return res.status(400).json({ error: "Invalid username or password." });
    }

    const user = results[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid username or password." });
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      "your-secret-key",
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful.",
      token,
      username: user.username,
      role: user.role,
    });

  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});



const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = './uploads';
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file size limit
}).fields([
  { name: "carImages", maxCount: 10 },
  { name: "paintingImage", maxCount: 1 },
  { name: "exteriorImage", maxCount: 1 },
  { name: "exteriorPartsImage", maxCount: 1 },
  { name: "lightsImage", maxCount: 1 },
  { name: "glassImage", maxCount: 1 },
  { name: "tyresImage", maxCount: 1 },
  { name: "interiorImage", maxCount: 1 },
  { name: "brakesImage", maxCount: 1 },
  { name: "acBatteryImage", maxCount: 1 },
  { name: "frontUnderbodyImage", maxCount: 1 },
  { name: "rearUnderbodyImage", maxCount: 1 },
  { name: "mechanicalImage", maxCount: 1 },
  { name: "image_url", maxCount: 1 }
]);






//car details get from admin
app.post("/api/cars", async (req, res) => {
  try {
    // Use the upload middleware
    await new Promise((resolve, reject) => {
      upload(req, res, (err) => {
        if (err) {
          return reject(new Error("File upload failed."));
        }
        resolve();
      });
    });

    const {
      carCondition,
      carType,
      brand,
      model,
      trim,
      style,
      fuel,
      color,
      transmission,
      capacity,
      year,
      price,
      mileage,
      warranty,
      previousOwners,
      accidentHistory,
      dynamicData: dynamicDataRaw, // Received as JSON string

    } = req.body;


    console.log(req.body)
  

    const carImages = req.files['carImages']?.map((file) => `/uploads/${file.filename}`) || [];

    console.log(carImages)

    
    // Insert car data
    const insertCarQuery = `
    INSERT INTO cars (
      car_condition, car_type, brand, model, trim, style,
      transmission, capacity, fuel_type, color, year, price, mileage, warranty,
      previous_owners, accident_history , image_url
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;


  const [carResult] = await db.query(insertCarQuery, [
    carCondition,
    carType,
    brand,
    model,
    trim,
    style,
    transmission,
    capacity,
    fuel,
    color,
    year || null,
    price,
    mileage || null,
    warranty || null,
    previousOwners || null,
    accidentHistory || null,
    carImages,
  ]);
  console.log(carImages)

    const carId = carResult.insertId;


// Parse and handle dynamicData
let dynamicData;
try {
  if (typeof dynamicDataRaw === 'string') {
    dynamicData = JSON.parse(dynamicDataRaw); // Parse only if it's a JSON string
  } else {
    dynamicData = dynamicDataRaw; // Use as-is if already an object
  }
} catch (err) {
  console.error("Failed to parse dynamicData:", err);
  return res.status(400).json({ error: "Invalid dynamicData format." });
}

if (dynamicData) {
  const dynamicInsertQuery = `
    INSERT INTO car_section_details (car_id, section, label, value)
    VALUES (?, ?, ?, ?)
  `;

  // Iterate through each section
  for (const [section, fieldsJson] of Object.entries(dynamicData)) {
    try {
      // Parse the JSON string for the current section
      const fields = JSON.parse(fieldsJson);

      // Insert each label and value pair into the database
      for (const { label, value } of fields) {
        if (label && value) {
          await db.query(dynamicInsertQuery, [carId, section, label, value]);
        }
      }
    } catch (err) {
      console.error(`Failed to parse fields for section "${section}":`, err);
    }
  }
}





    // Prepare and insert part images
    const partImages = [];
    const partStatuses = {};

    // Extract part images
    Object.keys(req.files).forEach((fileKey) => {
      if (fileKey.endsWith("Image")) {
        const part = fileKey.replace("Image", "");
        const file = req.files[fileKey]?.[0]?.filename;

        if (file) {
          const filePath = `/uploads/${file}`;
          partImages.push([carId, part, filePath]);
        }
      }
    });

    // Extract part statuses
    Object.entries(req.body).forEach(([key, value]) => {
      if (key.endsWith("Status")) {
        const part = key.replace("Status", "");
        partStatuses[part] = value || "N/A"; // Fallback to "N/A" if value is undefined/null
      }
    });

    // Insert into car_images if there are any part images
    if (partImages.length > 0) {
      const partsInsertQuery = `
        INSERT INTO car_images (car_id, part, image_url, status)
        VALUES (?, ?, ?, ?)
      `;
      for (const [carId, part, imageUrl] of partImages) {
        const status = partStatuses[part] || "N/A"; // Get the status for the part
        await db.query(partsInsertQuery, [carId, part, imageUrl, status]);
      }
    }

    // Insert into car_inspection
    const partsStatusInsertQuery = `
      INSERT INTO car_inspection (
        car_id, painting_status, exterior_status, exterior_parts_status,
        lights_status, glass_status, tyres_status, interior_status, brakes_status,
        ac_battery_status, front_underbody_status, rear_underbody_status, mechanical_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    await db.query(partsStatusInsertQuery, [
      carId,
      partStatuses.painting || "N/A",
      partStatuses.exterior || "N/A",
      partStatuses.exteriorParts || "N/A",
      partStatuses.lights || "N/A",
      partStatuses.glass || "N/A",
      partStatuses.tyres || "N/A",
      partStatuses.interior || "N/A",
      partStatuses.brakes || "N/A",
      partStatuses.acBattery || "N/A",
      partStatuses.frontUnderbody || "N/A",
      partStatuses.rearUnderbody || "N/A",
      partStatuses.mechanical || "N/A",
    ]);

    res.status(200).json({ message: "Car and inspection data saved successfully." });
  } catch (err) {
    console.error("Error in /api/cars:", err);
    res.status(500).json({ error: "An error occurred while processing the request." });
  }
});




app.get("/api/cars", async (req, res) => {
  try {
    const { condition, brand, minPrice, maxPrice, fuel, color } = req.query;
    let query = "SELECT * FROM cars WHERE 1=1";
    const params = [];

    if (condition) {
      query += " AND car_condition = ?";
      params.push(condition);
    }
    if (brand) {
      query += " AND brand = ?";
      params.push(brand);
    }
    if (fuel) {
      query += " AND fuel_type = ?";
      params.push(fuel);
    }
    if (color) {
      query += " AND color = ?";
      params.push(color);
    }
    if (minPrice) {
      query += " AND price >= ?";
      params.push(Number(minPrice));
    }
    if (maxPrice) {
      query += " AND price <= ?";
      params.push(Number(maxPrice));
    }

    const [cars] = await db.query(query, params);
    res.status(200).json(cars);
  } catch (error) {
    console.error("Error fetching cars:", error);
    res.status(500).json({ error: "Failed to fetch cars" });
  }
});




// Fetch a specific car by id with related images and inspection statuses
app.get("/api/cars/:id", async (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT cars.*, 
           GROUP_CONCAT(CONCAT(car_images.part, '|', car_images.status, '|', car_images.image_url)) AS parts_images,
           MAX(ci.painting_status) AS painting_status,
           MAX(ci.exterior_status) AS exterior_status,
           MAX(ci.exterior_parts_status) AS exterior_parts_status,
           MAX(ci.lights_status) AS lights_status,
           MAX(ci.glass_status) AS glass_status,
           MAX(ci.tyres_status) AS tyres_status,
           MAX(ci.interior_status) AS interior_status,
           MAX(ci.brakes_status) AS brakes_status,
           MAX(ci.ac_battery_status) AS ac_battery_status,
           MAX(ci.front_underbody_status) AS front_underbody_status,
           MAX(ci.rear_underbody_status) AS rear_underbody_status,
           MAX(ci.mechanical_status) AS mechanical_status
    FROM cars
    LEFT JOIN car_images ON cars.id = car_images.car_id
    LEFT JOIN car_inspection ci ON cars.id = ci.car_id
    WHERE cars.id = ?
    GROUP BY cars.id
  `;
  try {
    const [results] = await db.query(query, [id]);
    res.status(200).json(results[0] || {});
  } catch (err) {
    console.error("Error fetching car details:", err);
    res.status(500).json({ error: "Failed to fetch car details." });
  }
});













app.post("/api/bookings", (req, res) => {
  const { car_id, userId, name, email, phone, preferredDate, message } = req.body;

  const query = `
    INSERT INTO bookings (car_id, user_id, name, email, phone, preferred_date, message)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(query, [car_id, userId, name, email, phone, preferredDate, message], (err) => {
    if (err) {
      console.error("Error creating booking:", err);
      res.status(500).send("Failed to create booking.");
    } else {
      console.log("Booking created successfully.");
      res.status(201).send("Booking created successfully.");
    }
  });
});


// Fetch all bookings
app.get("/api/bookings", async (req, res) => {
  const query = `
    SELECT 
      b.id, b.user_id, b.name, b.email, b.phone, b.preferred_date, b.message, b.status, 
      c.brand, c.model, c.year, c.price, c.transmission, c.trim, c.image_url, c.color
    FROM bookings b
    JOIN cars c ON b.car_id = c.id
    ORDER BY b.created_at DESC;
  `;

  try {
    const [rows] = await db.query(query);
    res.status(200).json(rows);
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).send("Error fetching bookings.");
  }
});



// Update booking status
app.put("/api/bookings/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const query = "UPDATE bookings SET status = ? WHERE id = ?";
    const [result] = await db.query(query, [status, id]);

    if (result.affectedRows > 0) {
      res.status(200).send("Booking status updated successfully.");
    } else {
      res.status(404).send("Booking not found.");
    }
  } catch (err) {
    console.error("Error updating booking status:", err);
    res.status(500).send("Failed to update booking status.");
  }
});



app.get('/api/users-requests', async (req, res) => {
  try {
      const [results] = await db.query(`
          SELECT 
              users.id AS user_id,
              users.username,
              users.email,
              MIN(car_sales.id) AS request_id,
              MIN(car_sales.make) AS make,
              MIN(car_sales.model) AS model,
              MIN(car_sales.price) AS price,
              MIN(car_sales.status) AS status
          FROM 
              users
          LEFT JOIN 
              car_sales ON users.id = car_sales.user_id
          WHERE 
              users.role = 'user'
          GROUP BY 
              users.id, users.username, users.email;
      `);
      res.json(results);
  } catch (error) {
      console.error('Error fetching users and requests:', error);
      res.status(500).send('Error fetching data');
  }
});








app.post('/api/carsales', async (req, res) => {
  try {
    await new Promise((resolve, reject) => {
      upload(req, res, (err) => {
        if (err) {
          return reject(new Error("File upload failed."));
        }
        resolve();
      });
    });

    const {
      condition,
      make,
      carType,
      model,
      year,
      price,
      mileage,
      transmission,
      engineSize,
      name,
      email,
      phone,
      user_id, // Extract user_id from request body
    } = req.body;

    // Extract file information
    const image_url = req.files?.image_url?.[0]?.filename || null;

    // Validate required fields
    if (!condition || !model || !year || !price || !name || !email || !user_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Validate user_id (optional: check if user exists in the database)
    const userExistsQuery = `SELECT id FROM users WHERE id = ?`;
    const [userCheck] = await db.query(userExistsQuery, [user_id]);
    if (userCheck.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    // Insert car sales data into the database
    const sellCarQuery = `
      INSERT INTO car_sales (
        user_id, make, model, year, \`condition\`, price, mileage, carType, 
        transmission, engineSize, name, email, phone, image_url
      ) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await db.query(sellCarQuery, [
  user_id,
  make,
  model,
  year,
  condition,
  price,
  mileage || null,
  carType || null,
  transmission || null,
  engineSize || null,
  name,
  email,
  phone || null,
  image_url ? `/uploads/${image_url}` : null,
]);


    res.status(200).json({ message: "Car sale request submitted successfully!" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Server error while processing your request." });
  }
});



  // Fetch all car sales
  app.get('/api/carsales', async (req, res) => {
    try {
      const query = "SELECT * FROM car_sales"; // اسم الجدول الصحيح
      const [results] = await db.query(query);
      res.status(200).json(results);
    } catch (err) {
      console.error("Error fetching cars:", err);
      res.status(500).json({ error: "Failed to fetch cars." });
    }
  });
  



  app.post('/api/carsales/approve/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      await db.query('UPDATE car_sales SET status = ? WHERE id = ?', ['approved', id]);
      res.status(200).json({ success: true, message: 'Request approved' });
    } catch (error) {
      console.error('Error approving request:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  
  
  app.post('/api/carsales/reject/:id', async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  try {
    await db.query('UPDATE car_sales SET status = ?, rejection_reason = ? WHERE id = ?', [
      'rejected',
      reason || null,
      id
    ]);
    res.status(200).json({ success: true, message: 'Request rejected' });
  } catch (error) {
    console.error('Error rejecting request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

  
  
  











app.post("/api/messages", async (req, res) => {
  const { sender_id, receiver_id, message, admin_reply } = req.body;

  // Check for required fields
  if (!sender_id || !receiver_id || (!message && !admin_reply)) {
    return res.status(400).json({ error: "Message or admin_reply is required." });
  }

  try {
    // Determine if this is a user message or admin reply
    const query = `
      INSERT INTO messages (sender_id, receiver_id, message, admin_reply) 
      VALUES (?, ?, ?, ?)
    `;
    
    // If the sender is the admin, store the reply in admin_reply, else store in message
    await db.execute(query, [
      sender_id, 
      receiver_id, 
      message || null,   // If it's an admin message, this will be null
      admin_reply || null  // If it's a user message, this will be null
    ]);
    
    res.status(200).json({ message: "Message sent successfully!" });
  } catch (error) {
    console.error("Error saving message:", error);
    res.status(500).json({ error: "Failed to save message." });
  }
});


// Fetch all messages between a user and anyone (including admin)
app.get("/api/messages/all/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const [messages] = await db.execute(
      "SELECT sender_id, receiver_id, message FROM messages WHERE sender_id = ? OR receiver_id = ? ORDER BY created_at ASC",
      [userId, userId]
    );
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch messages." });
  }
});



// GET: Fetch all messages for a specific user
app.get("/api/messages", async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required." });
  }

  try {
    const query = `
      SELECT id, sender_id, receiver_id, message, admin_reply, status, created_at 
      FROM messages 
      WHERE sender_id = ?
      ORDER BY created_at ASC
    `;
    const [results] = await db.execute(query, [userId]);
    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages." });
  }
});


// Update the connection and use async/await directly with the query function
app.get('/api/admins', async (req, res) => {
  try {
    // Query the database to fetch admin data with id = 3 using async/await
    const [results] = await db.query('SELECT * FROM users WHERE role = ? AND id = ?', ['admin', 3]);

    // Check if any admins are found
    if (results.length === 0) {
      return res.status(404).json({ error: 'No admins found' });
    }

    // Return the found admins as JSON
    res.status(200).json(results);
  } catch (error) {
    // Handle any unforeseen errors
    console.error('Error processing request:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});




// Fetch only messages from the admin to the user (admin replies)
app.get("/api/messages/admin/:userId", async (req, res) => {
  const userId = req.params.userId;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required." });
  }

  try {
    const query = `
      SELECT sender_id, receiver_id, message, admin_reply 
      FROM messages 
      WHERE (sender_id = 3 AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
      ORDER BY created_at ASC;
    `;

    const [messages] = await db.execute(query, [userId, userId, 3]);

    res.status(200).json(messages);  // Send the messages (admin replies + user messages)
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages." });
  }
});


app.put('/api/messages/reply/:id', async (req, res) => {
  const { id } = req.params;
  const { adminReply } = req.body;

  if (!adminReply) {
    return res.status(400).json({ error: 'Admin reply is required' });
  }

  try {
    await db.query(
      `UPDATE messages 
       SET admin_reply = ?, status = ? 
       WHERE id = ?`,
      [adminReply, 'replied', id]
    );
    res.status(200).json({ success: true, message: 'Reply updated successfully!' });
  } catch (error) {
    console.error('Error updating reply:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});








app.post("/api/notifications", async (req, res) => {
  const { user_id, message } = req.body;

  if (!user_id || !message) {
    return res.status(400).json({ error: "User ID and message are required." });
  }

  try {
    await db.execute(
      `INSERT INTO notifications (user_id, message) VALUES (?, ?)`,
      [user_id, message]
    );
    res.status(200).json({ success: true, message: "Notification added successfully." });
  } catch (error) {
    console.error("Error adding notification:", error);
    res.status(500).json({ error: "Failed to add notification." });
  }
});


app.get("/api/notifications/:userId", async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required." });
  }

  try {
    const [notifications] = await db.execute(
      `SELECT id, message, is_read, created_at 
       FROM notifications 
       WHERE user_id = ? 
       ORDER BY created_at DESC`,
      [userId]
    );

    if (notifications.length === 0) {
      return res.status(404).json({ message: "No notifications found." });
    }

    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Failed to fetch notifications." });
  }
});



app.put("/api/notifications/mark-read/:userId", async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required." });
  }

  try {
    // تحقق من وجود إشعارات غير مقروءة
    const [unreadNotifications] = await db.execute(
      `SELECT id FROM notifications WHERE user_id = ? AND is_read = FALSE`,
      [userId]
    );

    if (unreadNotifications.length === 0) {
      return res.status(404).json({ message: "No unread notifications to mark as read." });
    }

    // تحديث الإشعارات
    await db.execute(`UPDATE notifications SET is_read = TRUE WHERE user_id = ?`, [userId]);

    res.status(200).json({ success: true, message: "Notifications marked as read." });
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    res.status(500).json({ error: "Failed to mark notifications as read." });
  }
});

// حذف الإشعارات المقروءة
app.delete("/api/notifications/clear-read/:userId", async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required." });
  }

  try {
    // حذف الإشعارات التي تم قراءتها فقط
    const [deletedNotifications] = await db.execute(
      `DELETE FROM notifications WHERE user_id = ? AND is_read = TRUE`,
      [userId]
    );

    // تحقق مما إذا تم حذف أي إشعارات
    if (deletedNotifications.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "No read notifications found to delete." });
    }

    res
      .status(200)
      .json({ success: true, message: "Read notifications cleared successfully." });
  } catch (error) {
    console.error("Error clearing read notifications:", error);
    res.status(500).json({ error: "Failed to clear read notifications." });
  }
});







  // Start Server
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
