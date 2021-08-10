import * as XLSX from 'xlsx';
import * as stream from 'stream';
import fs from 'fs';

interface RowObject {
  [key: string]: string;
}

class UploadFile {
  private inputId: string;

  constructor(inputId: string) {
    this.inputId = inputId;
  }

  public init(): void {
    let selectedFile: FileList;

    document.getElementById(this.inputId).addEventListener('change', (ev: Event) => {
      selectedFile = (<HTMLInputElement>ev.target).files;
    });

    /**
     * Displat Upload & generate file status
     *
     * @param {string} element
     * @param {string} text
     */
    const updateStatus: (element: string, text: string) => void = async (element: string, text: string) => {
      document.querySelector(element).textContent = text;
    };

    const getBase64Image: (src: string, name: string) => void = (src: string, name: string) => {
      const ReadableData: typeof stream.Readable = stream.Readable;

      const imageBufferData: Buffer = Buffer.from(src, 'base64');

      const streamObj: stream.Readable = new ReadableData();

      streamObj.push(imageBufferData);

      streamObj.push(null);

      streamObj.pipe(fs.createWriteStream(`${name}.png`));
    };

    const wait: (ms: number) => Promise<unknown> = async (ms: number) => {
      return new Promise((resolve: (arg: unknown) => void) => {
        setTimeout(resolve, ms);
      });
    };

    /**
     * Upload file to user folder
     *
     * @param {string} userId
     * @param {string} input
     * @param {string} filename
     */
    const uploadFile: (userId: string, input: string, filename: string, directory: string) => void = async (
      userId: string,
      input: string,
      filename: string,
      directory: string
    ) => {
      (() =>
        new Promise(() => {
          const formData: FormData = new FormData();

          formData.append('userId', userId);
          formData.append('file', input);
          formData.append('filename', filename);
          formData.append('directory', directory);

          const request: Request = new Request('../../generators/uploads/index.php', {
            method: 'POST',
            body: formData,
            headers: new Headers(),
          });

          fetch(request)
            .then((response: Response) => {
              if (response.status === 200) {
                // console.log(response);
              }
            })
            .catch((error: string) => {
              throw new Error(error);
            });
        }))();
    };

    const mkdir: (range: string) => Promise<void> = async (range: string) => {
      (() =>
        new Promise(() => {
          const formData: FormData = new FormData();

          formData.append('range', range);

          const request: Request = new Request('../../generators/mkdir/index.php', {
            method: 'POST',
            body: formData,
            headers: new Headers(),
          });

          fetch(request)
            .then((response: Response) => {
              if (response.status === 200) {
                // console.log(response);
              }
            })
            .catch((error: string) => {
              throw new Error(error);
            });
        }))();
    };

    const generatePDF: (directory: string, userId: string, serialNumber: string, label: string, photo: string) => void =
      (directory: string, userId: string, serialNumber: string, label: string, photo: string) => {
        const formData: FormData = new FormData();

        formData.append('directory', directory);
        formData.append('userId', userId);
        formData.append('serialNumber', serialNumber);
        formData.append('label', label);

        const request: Request = new Request('../../generators/pdf/index.php', {
          method: 'POST',
          body: formData,
          headers: new Headers(),
        });

        fetch(`https://localhost/generators/data/${directory}/${userId}/kid-photo.png`).then((response: Response) => {
          if (response.status === 200) {
            fetch(request)
              .then((resp: Response) => {
                if (resp.status === 200) {
                  // console.log(resp);
                }
              })
              .catch((error: string) => {
                throw new Error(error);
              });
          }
        });
      };

    const generateJSON: () => void = async () => {
      updateStatus('.status', 'Wczytuję plik...');

      let serialRange: string;

      let rowObject: RowObject[];

      if (selectedFile[0]) {
        const fileReader: FileReader = new FileReader();
        fileReader.readAsBinaryString(selectedFile[0]);
        fileReader.onload = async (event: Event) => {
          const dataFile: string | ArrayBuffer = (<FileReader>event.target).result;
          const workbook: XLSX.WorkBook = XLSX.read(dataFile, { type: 'binary' });

          updateStatus('.status', 'Generuję zdjęcia...');

          workbook.SheetNames.forEach((sheet: string) => {
            rowObject = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);

            serialRange = `${rowObject[0]['Serial number']}-${rowObject[rowObject.length - 1]['Serial number']}`;

            mkdir(serialRange);
            wait(300);

            rowObject.forEach((obj: RowObject) => {
              uploadFile(obj['Serial number'], obj.Photo, 'kid-photo', serialRange);
            });

            updateStatus('.status', 'Zapisuję...');

            wait(5000)
              .then(() => {
                document.getElementById('jsondata').innerHTML = JSON.stringify(rowObject, undefined, 4);
              })
              .then(() => {
                updateStatus('.status', 'Generuję pliki PDF...');
              })
              .then(() => {
                rowObject.forEach((obj: RowObject) => {
                  generatePDF(serialRange, obj['Serial number'], obj['User Id'], obj.Label, obj.Photo);
                });
              })
              .then(() => {
                updateStatus('.status', 'Gotowe!');
              });
          });
        };
      }
    };

    document.getElementById('button').addEventListener('click', generateJSON);
  }
}

export default UploadFile;
