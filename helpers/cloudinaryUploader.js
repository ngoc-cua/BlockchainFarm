// Hàm xử lý sự kiện khi người dùng tải lên hình ảnh
const handleImageUpload = () => {
  const imagePath = 'path_to_your_image'; // Thay thế bằng đường dẫn tới hình ảnh bạn muốn tải lên

  // Gửi yêu cầu tải lên hình ảnh lên Cloudinary
  cloudinary.uploader.upload(imagePath, function(result) {
    if (result && result.url) {
      const imageUrl = result.url;
      // Ở đây, bạn có thể sử dụng đường dẫn URL của hình ảnh (imageUrl) để thực hiện các tác vụ khác, ví dụ: tạo sản phẩm
      console.log('Image uploaded successfully. Image URL:', imageUrl);
    } else {
      console.error('Error uploading image to Cloudinary:', result);
    }
  });
};

// Gọi hàm xử lý sự kiện khi cần tải lên hình ảnh
handleImageUpload();
