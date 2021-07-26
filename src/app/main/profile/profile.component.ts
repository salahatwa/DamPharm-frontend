import { Component, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { HttpClient } from '@angular/common/http';
import { UserService } from 'src/app/shared/services/auth/user.service';
import { User } from 'src/app/core/classes/user.model';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ApiService } from 'src/app/shared/services/api.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  currentUser: User;
  userForm: FormGroup;

  constructor(private utilService: UtilsService, private http: HttpClient, private userService: UserService) {
    this.utilService.setDocTitle('profile.title', true);
  }

  ngOnInit(): void {
    this.userService.currentUser.subscribe((data) => {
      this.currentUser = data;
      this.initUserForm(this.currentUser);
    });
  }

  initUserForm(user: User) {
    this.userForm = new FormGroup({
      companyName: new FormControl(user.companyName),
      username: new FormControl({ value: user.username, disabled: true }),
      email: new FormControl(user.email),
      address: new FormControl(user.address),
      city: new FormControl({ value: user.city, disabled: false }),
      country: new FormControl({ value: user.country, disabled: false }),
      postalCode: new FormControl({ value: user.postalCode, disabled: false }),
      phone: new FormControl({ value: user.phone, disabled: false }),


      // gender: new FormControl(),
      // isMarried: new FormControl(),
      // country: new FormControl()
    })
  }

  onSubmit() {
    console.log(this.userForm.value);

    this.userService.update(this.userForm.value).subscribe((data) => {
      console.log(data);
    });
  }


  selectedFile: File;
  retrievedImage: any;

  public onFileChanged(event) {
    this.selectedFile = event.target.files[0];
    this.onUpload();
  }
  //Gets called when the user clicks on submit to upload the image
  onUpload() {
    console.log(this.selectedFile);
    //FormData API provides methods and properties to allow us easily prepare form data to be sent with POST HTTP requests.
    const uploadImageData = new FormData();
    uploadImageData.append('file', this.selectedFile, this.selectedFile.name);
    //Make a call to the Spring Boot Application to save the image
    this.userService.updateLogo(uploadImageData).subscribe((data) => {
      console.log(data);
    });

  }
}
