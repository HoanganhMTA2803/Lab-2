const express = require("express");
const User = require("../db/userModel");
const router = express.Router();

// 1. API lấy danh sách tất cả người dùng: GET /api/user/list
router.get("/list", async (request, response) => {
  try {
    const users = await User.find({}, "_id first_name last_name location occupation description");
    response.status(200).json(users);
  } catch (error) {
    console.error("Error fetching user list:", error);
    response.status(500).json({ error: "Internal Server Error" });
  }
});

// 2. API lấy thông tin chi tiết một user theo ID: GET /api/user/:id
router.get("/:id", async (request, response) => {
  try {
    const user = await User.findById(request.params.id);
    if (!user) {
      return response.status(404).json({ error: "User not found" });
    }
    response.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    response.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;