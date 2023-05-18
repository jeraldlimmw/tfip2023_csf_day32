import { Component, OnInit, inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Friend } from '../models';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit{
  
  /*
  normally ts will expect you to create the object using a constructor
  constructor() {
    this.friendsForm = null
  }
  OR
  friendsForm: FormGroup | null = null
  OR USE BELOW:
  */
  friendsForm!: FormGroup
  factsArray!: FormArray
  friend!: Friend
  nameField = 'name'
  
  /* @Autowired equivalent - constructor injection

  fb: FormBuilder
  constructor(fb: FormBuilder) {
    this.fb = fb
  }

  OR

  constructor(private fb: FormBuilder) { }
  
  OR USE BELOW:
  */
  fb: FormBuilder = inject(FormBuilder)

  ngOnInit(): void {
    console.info(">>>> form component initialising")
    this.friendsForm = this.createFormWithFB()
    const data = localStorage.getItem('friend')
    if (!!data) {
      this.friend = JSON.parse(data)
      console.info("friend from storage: ", this.friend)
    }
  }

  // CREATE FORM GROUP
  
  /* Without FormBuilder
   
  private createForm(): FormGroup {
    return new FormGroup({
      [this.nameField]: new FormControl<string>('', 
          [ Validators.required, Validators.minLength(3) ]), // name is now variable
      email: new FormControl<string>('', 
        [ Validators.required, Validators.email ]),
      age: new FormControl<number>(18, [ Validators.min(10) ]),
      gender: new FormControl<string>('')
    })
  }
  */
 
  private createFormWithFB(): FormGroup {
    this.factsArray = this.fb.array([]) //test array length manually
    return this.fb.group({
      [this.nameField]: this.fb.control<string>('', 
          [ Validators.required, Validators.minLength(3) ]),
      email: this.fb.control<string>('',
          [ Validators.required, Validators.email ]),
      age: this.fb.control<number>(18, [ Validators.min(18) ]),
      gender: this.fb.control<string>(''),
      facts: this.factsArray
    })
  }

  // CREATE FORM ARRAYS

  private createFriendsFact(): FormGroup {
    return this.fb.group({
      fact: new FormControl<string>('', [ Validators.minLength(3), 
          Validators.maxLength(16) ]),
      value: this.fb.control('', [ Validators.minLength(5) ])
    })
  }
  
  // METHODS

  processForm() {
    // construct friend object of type Friend
    const friend: Friend = this.friendsForm.value
    console.info(">>>> processing form", friend)
    localStorage.setItem('friend', JSON.stringify(friend)) // OR sessionStorage
    // this.friendsForm = this.createFormWithFB() OR
    this.friendsForm.reset();
  }

  addAFact() {
    this.factsArray.push(
      this.createFriendsFact()
    )
  }

  removeAFact(i: number) {
    this.factsArray.removeAt(i)
  }

  // VALIDATION OF FIELDS AND FORM

  invalidField(ctrlName: string): boolean {
    // first ! converts the data type to boolean
    // second ! reverts it to its original true or false
    return !!(this.friendsForm.get(ctrlName)?.invalid 
            && this.friendsForm.get(ctrlName)?.dirty)
    // if ctrlName is null, don't do this
  }

  invalidForm() {
    return this.friendsForm.invalid || this.factsArray.length <= 0
  }
}
