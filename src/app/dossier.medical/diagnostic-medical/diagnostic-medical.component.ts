import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounce, debounceTime, map, Observable, of, switchMap } from 'rxjs';
import { IcdService } from '../../services/icd/icd.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from "@angular/material/icon";
interface IcdCode {
  code: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-diagnostic-medical',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatChipsModule,
    MatButtonModule,
    MatInputModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatIconModule
],
  templateUrl: './diagnostic-medical.component.html',
  styleUrl: './diagnostic-medical.component.css'
})

export class DiagnosticMedicalComponent implements OnInit{
    @Input() form!: FormGroup;

    filteredCodes$!: Observable<IcdCode[]>;
    secondaryControl = new FormControl('', Validators.required);

    constructor(private fb: FormBuilder, private icdService: IcdService) {}

    ngOnInit(): void {
      this.filteredCodes$ = this.form.get('codePrincipal')!.valueChanges.pipe(
        debounceTime(300),
        switchMap(value => this.searchICDCodes(value))
      );
      this.filteredCodes$.subscribe(codes => console.log(codes));
    }

    addSecondary(): void {
    const value = this.secondaryControl.value?.trim();
    if (value) {
      this.diagnosticsSecondaires.push(this.fb.control(value, Validators.required));
      this.secondaryControl.reset();
    }
  }
  
    removeSecondary(index: number) : void {
        this.diagnosticsSecondaires.removeAt(index);
    }

    get diagnosticsSecondaires() : FormArray {
        return this.form.get('diagnosticsSecondaires') as FormArray;
    }

    private searchICDCodes(query: string): Observable<any[]> {
      if (!query || query.length < 2) return of([]);
      const system = this.form.get('systemeCodification')?.value;
      if (system === 'ICD-11') {
          return this.icdService.searchICD11Codes(query);
      } else if (system === 'ICD-10') {
          return this.icdService.searchICD10Codes(query);
      } else {
          return of([]);
      }
    }

    selectCode(item: any): void {
        this.form.get('codePrincipal')?.setValue(item.code);
        this.form.get('diagnosticPrincipal')?.setValue(item.title);
    }

}
