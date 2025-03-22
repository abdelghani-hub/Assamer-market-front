import {AbstractControl, ValidationErrors} from '@angular/forms';

export class FileUtil {
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

  static fileTypeValidator(allowedTypes: string[]) {
    return (control: AbstractControl): ValidationErrors | null => {
      const files = control.value;

      if (!files) {
        return null;
      }

      // Handle both array of Files and FileList
      let fileArray: File[];
      if (files instanceof FileList) {
        fileArray = Array.from(files);
      } else if (Array.isArray(files)) {
        fileArray = files;
      } else if (files instanceof File) {
        fileArray = [files];
      } else {
        return null;
      }

      const invalidFiles = fileArray.filter(file => !allowedTypes.includes(file.type));

      return invalidFiles.length > 0 ? {fileType: true} : null;
    };
  }
}
