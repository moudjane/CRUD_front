import { Component, OnInit } from '@angular/core';
import { UserService, User } from './user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  users: User[] = [];
  newUser: User = { id: 0, firstName: '', lastName: '', occupation: '', age: 0 };

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.users$.subscribe((users: User[]) => {
      this.users = users;
    });
  }

  onSubmit(): void {
    this.userService.addUser(this.newUser);
    this.newUser = { id: 0, firstName: '', lastName: '', occupation: '', age: 0 };
  }

  deleteUser(userId: number): void {
    if (confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) {
      this.userService.deleteUser(userId);
    }
  }

  // Fonction pour activer ou désactiver l'édition pour un utilisateur.
  editUser(user: User): void {
    this.userService.toggleEditUser(user);
  }

  // Fonction pour mettre à jour un utilisateur.
  updateUser(user: User): void {
    this.userService.updateUser(user);
    // Désactivez le mode d'édition après la mise à jour.
    this.userService.toggleEditUser(user);
  }
}
