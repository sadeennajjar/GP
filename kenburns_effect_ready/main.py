import cv2
import numpy as np
import imageio
import os
from datetime import datetime

def ease_in_out(t):
    return 3*t**2 - 2*t**3

img_path = "/workspace/kenburns_effect_ready/kitchen.png"
depth_path = "/workspace/kenburns_effect_ready/depth_midas.png"
output_dir = "/workspace/kenburns_effect_ready/output"
os.makedirs(output_dir, exist_ok=True)

img = cv2.imread(img_path)
if img is None:
    raise FileNotFoundError(f"Could not load image: {img_path}")

depth = cv2.imread(depth_path, cv2.IMREAD_GRAYSCALE)
if depth is None:
    raise FileNotFoundError(f"Could not load depth map: {depth_path}")

depth = cv2.resize(depth, (img.shape[1], img.shape[0]))
depth = depth.astype(np.float32) / 255.0
depth = cv2.GaussianBlur(depth, (15, 15), 0)

num_frames = 180  # slower: 6 seconds at 30 fps
fps = 30
zoom_range = 1.5  # zoom in 50%

height, width = img.shape[:2]
cx, cy = width / 2, height / 2

max_vertical_shift = 15

frames = []
center_depth = np.mean(depth)

for i in range(num_frames):
    t = i / (num_frames - 1)
    eased_t = ease_in_out(t)
    scale = 1.0 + (zoom_range - 1.0) * eased_t

    # Uniform zoom centered on image
    M_zoom = cv2.getRotationMatrix2D((cx, cy), 0, scale)
    zoomed_img = cv2.warpAffine(img, M_zoom, (width, height), borderMode=cv2.BORDER_REFLECT)

    # Only vertical parallax (no horizontal)
    parallax_y = (depth - center_depth) * max_vertical_shift * eased_t

    # Optional vertical tilt effect
    tilt_offset = max_vertical_shift * 0.5 * np.sin(2 * np.pi * i / num_frames)

    map_x, map_y = np.meshgrid(np.arange(width), np.arange(height))
    map_x = map_x.astype(np.float32)  # no horizontal shift
    map_y = (map_y + parallax_y + tilt_offset).astype(np.float32)

    warped = cv2.remap(zoomed_img, map_x, map_y, interpolation=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)

    frames.append(cv2.cvtColor(warped, cv2.COLOR_BGR2RGB))

# Fade-out effect
fade_frames = 15
for i in range(fade_frames):
    alpha = 1 - (i + 1) / fade_frames
    faded_frame = (frames[-1].astype(np.float32) * alpha).astype(np.uint8)
    frames.append(faded_frame)

timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
output_filename = f"kenburns_{timestamp}.mp4"
output_path = os.path.join(output_dir, output_filename)

imageio.mimsave(output_path, frames, fps=fps, quality=8)
print(f"✅ Final slow zoom video with NO left/right movement saved as {output_path}")
