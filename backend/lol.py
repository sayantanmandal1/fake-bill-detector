from PIL import Image, ImageFilter

# Create a simple image (solid red)
img = Image.new("RGB", (100, 100), color="red")

# Apply Gaussian blur filter
blurred_img = img.filter(ImageFilter.GaussianBlur(radius=2))

# Save or show to verify visually
blurred_img.show()
# blurred_img.save("blurred_test.png")
