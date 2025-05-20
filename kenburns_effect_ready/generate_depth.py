import torch
import cv2
import numpy as np

# Set device
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Load model
model_type = "DPT_Large"
midas = torch.hub.load("intel-isl/MiDaS", model_type)
midas.to(device).eval()

# Load transforms
midas_transforms = torch.hub.load("intel-isl/MiDaS", "transforms")
transform = midas_transforms.dpt_transform

# Load image
img_path = "kitchen.png"
img = cv2.imread(img_path)
img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

# Apply transform
input_tensor = transform(img_rgb).to(device)

# Run depth prediction
with torch.no_grad():
    prediction = midas(input_tensor)
    prediction = torch.nn.functional.interpolate(
        prediction.unsqueeze(1),
        size=img.shape[:2],
        mode="bicubic",
        align_corners=False
    ).squeeze()

# Convert to numpy
depth = prediction.cpu().numpy()

# Optional: Clip extremes (remove outliers)
vmin, vmax = np.percentile(depth, 5), np.percentile(depth, 95)
depth_clipped = np.clip(depth, vmin, vmax)

# Normalize to 0-255 for visualization
depth_norm = cv2.normalize(depth_clipped, None, 0, 255, cv2.NORM_MINMAX)
depth_uint8 = depth_norm.astype(np.uint8)

# Apply color map for better visualization
depth_colored = cv2.applyColorMap(depth_uint8, cv2.COLORMAP_INFERNO)

# Optional: smooth depth map while preserving edges
depth_colored = cv2.bilateralFilter(depth_colored, d=9, sigmaColor=75, sigmaSpace=75)

# Save colored depth map
cv2.imwrite("depth_midas_colored.png", depth_colored)

# Save raw depth in 16-bit PNG for precision if needed
depth_16bit = (2550 * (depth_clipped - vmin) / (vmax - vmin)).astype(np.uint16)
cv2.imwrite("depth_midas_16bit.png", depth_16bit)

print("✅ Saved colored depth map as depth_midas_colored.png")
print("✅ Saved 16-bit depth map as depth_midas_16bit.png")

# Optional: visualize side-by-side
combined = np.hstack((img, cv2.cvtColor(depth_colored, cv2.COLOR_BGR2RGB)))
cv2.imshow("Input Image and Depth Map", combined)
cv2.waitKey(0)
cv2.destroyAllWindows()
