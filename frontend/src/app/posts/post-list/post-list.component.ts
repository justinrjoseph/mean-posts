import { Component, OnInit, AfterViewInit } from '@angular/core';

import { User } from '../../shared/models/user';
import { Post, PostData } from '../../shared/models/post';

import { AuthService } from '../../shared/services/auth.service';
import { PostService } from '../../shared/services/post.service';

import { PageEvent } from '@angular/material';

@Component({
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, AfterViewInit {
  isLoading = false;
  loggedIn = false;

  user: User;
  posts: Post[] = [];

  totalPosts = 0;
  currentPage = 1;
  postsPerPage = 1;
  pageSizeOptions = Array.from(Array(51).keys());

  constructor(private _auth: AuthService, private _postService: PostService) {}

  ngOnInit(): void {
    this.isLoading = true;

    this._loadPosts();

    this._postService.getUpdatedPosts()
      .subscribe(({ posts, count }: PostData) => {
        this.isLoading = false;
        this.posts = posts;
        this.totalPosts = count;
      });

    this._auth.loggedIn()
      .subscribe((isLoggedIn: boolean) => this.loggedIn = isLoggedIn);

    this.user = this._auth.currentUser;
  }

  ngAfterViewInit(): void {
    this.pageSizeOptions.shift();
  }

  deletePost(id: string): void {
    this.isLoading = true;

    this._postService.delete(id)
      .subscribe(
        () => this._postService.getAll(this.currentPage, this.postsPerPage),
        () => this.isLoading = false
      );
  }

  changePage(page: PageEvent): void {
    this.isLoading = true;

    this.currentPage = page.pageIndex + 1;
    this.postsPerPage = page.pageSize;

    this._loadPosts();
  }

  private _loadPosts(): void {
    this._postService.getAll(this.currentPage, this.postsPerPage);
  }
}
