const express = require("express");
const Photo = require("../db/photoModel");
const router = express.Router();

// API lấy danh sách ảnh của một user cụ thể: GET /api/photo/photosOfUser/:id
router.get("/photosOfUser/:id", async (request, response) => {
  try {
    const userId = request.params.id;
    
    // Truy vấn MongoDB và populate thông tin user đăng ảnh cũng như user viết comment
    const photos = await Photo.find({ user_id: userId })
      .populate("user_id", "_id first_name last_name")
      .populate({
        path: "comments.user_id",
        select: "_id first_name last_name",
      })
      .lean(); // Dùng lean() để dễ dàng tùy chỉnh object trước khi gửi về client

    // Chuẩn hóa lại cấu trúc dữ liệu để khớp hoàn toàn với Frontend
    const result = photos.map(photo => {
      return {
        ...photo,
        // Đảm bảo các trường id được chuyển đổi linh hoạt nếu cần
        user: photo.user_id,
        comments: (photo.comments || []).map(comment => ({
          ...comment,
          user: comment.user_id, // Gán user_id vào user để Frontend đọc comment.user.first_name không bị undefined
        }))
      };
    });

    response.status(200).json(result);
  } catch (error) {
    console.error("Error fetching user photos:", error);
    response.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;