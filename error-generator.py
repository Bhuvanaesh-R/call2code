from PIL import Image, ImageDraw, ImageFont
import os

def genimage(top, bottom):
    # Image properties
    image_width = 2880
    image_height = 1800
    background_img = "static/imgs/classroom_board.jpg"
    text_color = (255, 255, 255)

    # Load background image and convert to RGBA
    img = Image.open(background_img).convert("RGBA")
    img = img.resize((image_width, image_height))

    # Transparent overlay for semi-transparent text box
    overlay = Image.new("RGBA", img.size, (255, 255, 255, 0))
    draw = ImageDraw.Draw(overlay)

    # Try to use a truetype font with larger size, else fall back
    try:
        top_font = ImageFont.truetype("arial.ttf", 200)
        bottom_font = ImageFont.truetype("arial.ttf", 160)
    except:
        top_font = ImageFont.load_default()
        bottom_font = ImageFont.load_default()

    # Calculate position of top text
    top_text_size = draw.textbbox((0, 0), top, font=top_font)
    top_x = (image_width - (top_text_size[2] - top_text_size[0])) // 2
    top_y = image_height // 3 - 100

    # Calculate position of bottom text
    bottom_text_size = draw.textbbox((0, 0), bottom, font=bottom_font)
    bottom_x = (image_width - (bottom_text_size[2] - bottom_text_size[0])) // 2
    bottom_y = image_height * 2 // 3

    # Draw transparent rectangles for readability
    rectangle_margin = 60
    transparent_black = (0, 0, 0, 0)

    draw.rectangle(
        [(top_x - rectangle_margin, top_y - 40),
         (top_x + top_text_size[2] - top_text_size[0] + rectangle_margin, top_y + 120)],
        fill=transparent_black
    )

    draw.rectangle(
        [(bottom_x - rectangle_margin, bottom_y - 40),
         (bottom_x + bottom_text_size[2] - bottom_text_size[0] + rectangle_margin, bottom_y + 100)],
        fill=transparent_black
    )

    # Draw text on overlay
    draw.text((top_x, top_y), top, font=top_font, fill=text_color)
    draw.text((bottom_x, bottom_y), bottom, font=bottom_font, fill=text_color)

    # Combine base image with overlay
    final_image = Image.alpha_composite(img, overlay)

    # Save output
    output_path = f"static/generated/{top}_{bottom}.png"
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    final_image.save(output_path)

    return output_path
