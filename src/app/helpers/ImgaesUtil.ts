
export class ImgaesUtil {
  static getLessLoadedImage(images: string[]): string {
    if (!images || images.length === 0) {
      return '';
    }
    // Find the smallest image;
    let smallestImage = images[0];
    let smallestImageSize = 0;
    images.forEach(image => {
      const size = image.length;
      if (size < smallestImageSize) {
        smallestImage = image;
        smallestImageSize = size;
      }
    });
    return smallestImage;
  }
}
