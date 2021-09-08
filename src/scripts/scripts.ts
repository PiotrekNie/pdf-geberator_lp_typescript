import '../components/components';
import 'tailwindcss/tailwind.css';
import UploadFile from './partials/Upload';

class App {
  private upload: UploadFile = new UploadFile('input', '#button', '#filename');

  constructor() {
    this.initApp();
  }

  public initApp(): void {
    this.upload.init();
  }
}

document.addEventListener('DOMContentLoaded', () => new App());
