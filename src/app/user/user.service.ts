import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  occupation: string;
  age: number;
  editing?: boolean; // Ajoutez la propriété 'editing' pour activer l'édition
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users: User[] = [];
  private usersSubject = new BehaviorSubject<User[]>([]);

  constructor(private http: HttpClient) {
    this.fetchUsers();
  }

  get users$() {
    return this.usersSubject.asObservable();
  }

  fetchUsers(): void {
    this.http.get<User[]>('http://localhost:8080/users').subscribe(
      (users: User[]) => {
        // Ajoutez la propriété 'editing' à chaque utilisateur
        this.users = users.map(user => ({ ...user, editing: false }));
        this.usersSubject.next([...this.users]);
      },
      (error) => {
        console.log('Une erreur s\'est produite lors de la récupération des utilisateurs :', error);
      }
    );
  }

  addUser(newUser: User): void {
    const userExists = this.users.some(
      user => user.firstName === newUser.firstName && user.lastName === newUser.lastName
    );
    if (userExists) {
      console.log('Cet utilisateur existe déjà.');
      return;
    }

    this.http.post('http://localhost:8080/save', newUser, { responseType: 'text' }).subscribe(
      () => {
        console.log('Utilisateur ajouté avec succès');
        this.getUsers();
      },
      (error) => {
        console.error('Erreur lors de l\'ajout de l\'utilisateur', error);
      }
    );
  }

  getUsers(): void {
    this.http.get<User[]>('http://localhost:8080/users').subscribe(
      (users: User[]) => {
        this.users = users.map(user => ({ ...user, editing: false }));
        this.usersSubject.next([...this.users]);
      },
      (error) => {
        console.error('Une erreur s\'est produite lors de la récupération des utilisateurs :', error);
      }
    );
  }

  deleteUser(userId: number): void {
    this.http.delete(`http://localhost:8080/delete/${userId}`, { responseType: 'text' }).subscribe(
      () => {
        console.log(`Utilisateur avec l'ID ${userId} supprimé avec succès`);
        this.users = this.users.filter(user => user.id !== userId);
        this.usersSubject.next([...this.users]);
      },
      (error) => {
        console.error(`Erreur lors de la suppression de l'utilisateur avec l'ID ${userId}`, error);
      }
    );
  }

  // Fonction pour activer ou désactiver l'édition pour un utilisateur.
  toggleEditUser(user: User): void {
    user.editing = !user.editing;
  }

// Fonction pour mettre à jour un utilisateur.
  updateUser(updatedUser: User): void {
    this.http.put(`http://localhost:8080/update/${updatedUser.id}`, updatedUser).subscribe(
      () => {
        console.log('Utilisateur mis à jour avec succès');
        this.getUsers(); // Rafraîchissez la liste des utilisateurs après la mise à jour.
      },
      (error) => {
        console.error('Erreur lors de la mise à jour de l\'utilisateur', error);
      }
    );
  }

}
