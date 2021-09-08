import * as XLSX from 'xlsx';

interface RowObject {
  [key: string]: string;
}

class UploadFile {
  private inputId: string;

  private buttonClass: string;

  private fileNameId: string;

  constructor(inputId: string, buttonClass: string, fileNameId: string) {
    this.inputId = inputId;
    this.buttonClass = buttonClass;
    this.fileNameId = fileNameId;
  }

  public init(): void {
    let selectedFile: FileList;
    const button: HTMLButtonElement = document.querySelector(this.buttonClass);
    const filenameSpan: HTMLElement = document.querySelector(this.fileNameId);
    const funcMouseOver: (ev: Event) => void = (ev: Event) => {
      const inputContainer: HTMLElement = (<HTMLInputElement>ev.target).parentElement;

      if (ev.type === 'dragleave') {
        inputContainer.className =
          'relative h-40 rounded-lg border-dashed border-2 border-gray-200 bg-white flex justify-center items-center hover:cursor-pointer';
        return;
      }

      inputContainer.className =
        'relative h-40 rounded-lg border-dashed border-2 border-blue-400 bg-gray-100 flex justify-center items-center hover:cursor-pointer';
    };

    document.getElementById(this.inputId).addEventListener('change', (ev: Event) => {
      selectedFile = (<HTMLInputElement>ev.target).files;

      if (!button || !filenameSpan) {
        return;
      }

      if (selectedFile.length > 0) {
        button.disabled = false;
        filenameSpan.textContent = selectedFile[0].name;
        filenameSpan.parentElement.className = 'button';
      }
    });

    document.getElementById(this.inputId).addEventListener('dragenter', funcMouseOver, false);
    document.getElementById(this.inputId).addEventListener('dragleave', funcMouseOver, false);
    document.getElementById(this.inputId).addEventListener('dragover', funcMouseOver, false);
    document.getElementById(this.inputId).addEventListener('drop', funcMouseOver, false);

    /**
     * Displat Upload & generate file status
     *
     * @param {string} element
     * @param {string} text
     */
    const updateStatus: (element: string, text: string) => void = async (element: string, text: string) => {
      document.querySelector(element).textContent = text;
    };

    // const getBase64Image: (src: string, name: string) => void = (src: string, name: string) => {
    //   const ReadableData: typeof stream.Readable = stream.Readable;

    //   const imageBufferData: Buffer = Buffer.from(src, 'base64');

    //   const streamObj: stream.Readable = new ReadableData();

    //   streamObj.push(imageBufferData);

    //   streamObj.push(null);

    //   streamObj.pipe(fs.createWriteStream(`${name}.png`));
    // };

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

          const request: Request = new Request('../generators/uploads/index.php', {
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

          const request: Request = new Request('../generators/mkdir/index.php', {
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

    const generatePDF: (directory: string, userId: string, serialNumber: string, label: string) => void = (
      directory: string,
      userId: string,
      serialNumber: string,
      label: string
    ) => {
      const formData: FormData = new FormData();

      formData.append('directory', directory);
      formData.append('userId', userId);
      formData.append('serialNumber', serialNumber);
      formData.append('label', label);

      const request: Request = new Request('../generators/pdf/index.php', {
        method: 'POST',
        body: formData,
        headers: new Headers(),
      });

      fetch(`${document.location.origin}/generators/data/${directory}/${userId}/kid-photo.png`).then(
        (response: Response) => {
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
        }
      );
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
              // .then(() => {
              //   document.getElementById('jsondata').innerHTML = JSON.stringify(rowObject, undefined, 4);
              // })
              .then(() => {
                updateStatus('.status', 'Generuję pliki PDF...');
              })
              .then(() => {
                rowObject.forEach((obj: RowObject) => {
                  generatePDF(serialRange, obj['Serial number'], obj['User Id'], obj.Label);
                });
              })
              .then(() => {
                updateStatus('.status', 'Gotowe!');
              })
              .then(() => {
                if (!button || !filenameSpan) {
                  return;
                }

                button.disabled = true;
                filenameSpan.textContent = '';
                filenameSpan.parentElement.className = 'hidden';
              });
          });
        };
      }
    };

    document.getElementById('button').addEventListener('click', generateJSON);
  }
}

export default UploadFile;
