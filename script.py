from PIL import Image
with open('remove.png', 'rb') as my_photo:
    opened_image = Image.open(my_photo)
    opened_image.thumbnail((50, 50))
    opened_image.save('remove.png')
