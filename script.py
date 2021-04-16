from PIL import Image
with open('popup/remove.png', 'rb') as my_photo:
    opened_image = Image.open(my_photo)
    opened_image.thumbnail((30, 30))
    opened_image.save('remove.png')
