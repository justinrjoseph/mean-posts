import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';

import { Post, PostData } from '../models/post';

import { Observable, Subject } from 'rxjs';

import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private _url = `${environment.api}/posts`;

  private _data: PostData;
  private _postsUpdated = new Subject<PostData>();

  constructor(private _http: HttpClient, private _router: Router) {}

  getAll(page: number, pageSize: number): void {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    this._http.get<PostData>(this._url, { params })
      .subscribe((data: PostData) => {
        this._data = data;
        this._postsUpdated.next(this._data);
      });
  }

  getOne(id: string): Observable<Post> {
    return this._http.get<Post>(`${this._url}/${id}`);
  }

  add(newPost: Post): void {
    // FormData supports text and blobs
    const payload = new FormData();

    payload.append('title', newPost.title);
    payload.append('content', newPost.content);
    payload.append('image', newPost.imagePath, newPost.title);

    this._http.post<Post>(this._url, payload)
      .subscribe(() => this._router.navigate(['/']));
  }

  update(post: Post): void {
    let payload: (Post | FormData) = post;

    if ( typeof(post.imagePath) === 'object' ) {
      payload = new FormData();

      payload.append('title', post.title);
      payload.append('content', post.content);
      payload.append('image', post.imagePath, post.title);
    }

    this._http.put<Post>(`${this._url}/${post._id}`, payload)
      .subscribe(() => this._router.navigate(['/']));
  }

  delete(id: string): Observable<Post> {
    return this._http.delete<Post>(`${this._url}/${id}`);
  }

  getUpdatedPosts(): Observable<PostData> {
    return this._postsUpdated.asObservable();
  }
}
