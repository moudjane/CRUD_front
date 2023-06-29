import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  occupation: string;
  age: number;
}

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  users: User[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<User[]>('http://localhost:8080/users').subscribe(
      (users: User[]) => {
        this.users = users;
      },
      (error) => {
        console.log('Une erreur s\'est produite lors de la récupération des utilisateurs :', error);
      }
    );
  }
}
