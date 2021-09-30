import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';



export function minimum(min: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        if ((control.value == null) || min == null) {
            return null;
            // don't validate empty values to allow optional controls
        }
        const value = parseInt(control.value);


        let err = value >= min ?
            { 'minimum': true, 'actual': control.value } : null;

        return err;
    };
}


export function maximum(min: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        if ((control.value == null) || min == null) {
            return null;
            // don't validate empty values to allow optional controls
        }
        const value = parseInt(control.value);


        let err = value <= min ?
            { 'maximum': true, 'actual': control.value } : null;

        return err;
    };
}