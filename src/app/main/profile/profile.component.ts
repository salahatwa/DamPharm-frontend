import { Component, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

constructor(private utilService:UtilsService,private http:HttpClient)
{
  this.utilService.setDocTitle('profile.title',true);
}

  ngOnInit(): void {
  }

  preventAbuse = false;
  testHttp() {
    this.preventAbuse = true;
    this.http.get('https://reqres.in/api/users?delay=2').subscribe(res => {
      console.log(res);
      setTimeout(() => {
        this.preventAbuse = false;
      }, 800);
    });
  }

}
