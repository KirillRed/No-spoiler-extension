from PIL import Image
with open('256x256.png', 'rb') as my_photo:
    opened_image = Image.open(my_photo)
    opened_image.thumbnail((128, 128))
    opened_image.save('128x128.png')
    opened_image.thumbnail((48, 48))
    opened_image.save('48x48.png')
    opened_image.thumbnail((32, 32))
    opened_image.save('32x32.png')
    opened_image.thumbnail((16, 16))
    opened_image.save('16x16.png')
