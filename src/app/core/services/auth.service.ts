import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {map} from 'rxjs/operators';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {jwtDecode} from "jwt-decode";
import User from '../../types/User';

interface AuthResponse {
    token: string;
}

interface RegisterRequest {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    cin: string;
    nationality: string;
}

interface LoginRequest {
    email: string;
    password: string;
}


@Injectable({
    providedIn: 'root'
})

export class AuthService {
    private currentUserSubject: BehaviorSubject<AuthResponse | null>;
    public currentUser: Observable<AuthResponse | null>;
    private apiUrl: string = 'http://localhost:8080/api/v1';
    private http: HttpClient;
    private router: Router;

    constructor(http: HttpClient, router: Router) {
        this.currentUserSubject = new BehaviorSubject<AuthResponse | null>(
            window.localStorage.getItem('currentUser')
                ? JSON.parse(window.localStorage.getItem('currentUser')!)
                : null
        );
        this.currentUser = this.currentUserSubject.asObservable();
        this.http = http;
        this.router = router;
    }

    register(userData: RegisterRequest): Observable<AuthResponse> {
        return this.http
            .post<AuthResponse>(`${this.apiUrl}/auth/register`, userData)
            .pipe(
                map(res => {
                    window.localStorage.setItem('currentUser', JSON.stringify(res));
                    this.currentUserSubject.next(res);
                    return res;
                })
            );
    }


    login(loginRequest: LoginRequest): Observable<AuthResponse> {
        return this.http
            .post<AuthResponse>(`${this.apiUrl}/auth/login`, loginRequest)
            .pipe(
                map(res => {
                    window.localStorage.setItem('currentUser', JSON.stringify(res));
                    this.currentUserSubject.next(res);
                    return res;
                })
            );
    }

    public get currentUserValue(): AuthResponse | null {
        return this.currentUserSubject.value;
    }

    logout() {
        window.localStorage.removeItem('currentUser');
        this.router.navigate(['/home']).then(() => {
            window.location.reload();
        });
        this.currentUserSubject.next(null);
    }


    getRoleRoute(res: AuthResponse) {
        // redirect depending on role
        let user = jwtDecode<User>(res.token);
        switch (user.role) {
            case 'ADMIN':
                return '/dashboard';
            case 'SELLER':
                return '/seller';
            default:
                return '/home';
        }
    }

    get user(): User | null {
        return this.currentUserValue?.token ? jwtDecode<User>(this.currentUserValue.token) : null;
    }
}
