import { AbstractControl, ValidationErrors } from '@angular/forms';

import { Observable, Observer, of } from 'rxjs';

export class MimeTypeValidators {
  static mustBeImage(control: AbstractControl): Observable<null | ValidationErrors> {
    if ( typeof(control.value) === 'string' ) {
      return of(null);
    }

    const file = control.value as File;

    const fr = new FileReader();

    return Observable.create((observer: Observer<null | ValidationErrors>) => {
      fr.addEventListener('loadend', () => {
        const arr = new Uint8Array(fr.result as ArrayBuffer).subarray(0, 4);

        let header = '';

        for ( let i = 0; i < arr.length; i++ ) {
          header = arr[i].toString(16);
        }

        const valid = header.match(/47|e0|e1|e2|e3|e8/);

        if ( valid ) {
          observer.next(null);
        } else {
          observer.next({ invalidMimeType: true });
        }

        observer.complete();
      });

      fr.readAsArrayBuffer(file);
    });
  }
}
