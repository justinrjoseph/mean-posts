import { Component, OnInit, ViewChild } from '@angular/core';

import { ActivatedRoute, Params, Router } from '@angular/router';

import { FormGroup, FormBuilder, Validators, AbstractControl, NgForm } from '@angular/forms';

import { Modes } from '../../shared/models/modes.enum';
import { Post } from '../../shared/models/post';

import { PostService } from '../../shared/services/post.service';

import { MimeTypeValidators } from './mime-type.validators';

@Component({
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.css']
})
export class PostFormComponent implements OnInit {
  private _mode = Modes.Create;

  isLoading = false;
  form: FormGroup;
  id: string;
  imagePreview;

  @ViewChild('f') ngForm: NgForm;

  constructor(
    private _route: ActivatedRoute,
    private _fb: FormBuilder,
    private _postService: PostService
  ) {}

  ngOnInit(): void {
    this.form = this._fb.group({
      title: ['', Validators.required],
      image: [null, [Validators.required], MimeTypeValidators.mustBeImage],
      content: ['', Validators.required]
    });

    this._route.params.subscribe((params: Params) => {
      if ( params.id ) {
        this._mode = Modes.Edit;

        this.isLoading = true;

        this._postService.getOne(params.id)
          .subscribe((post: Post) => {
            this.isLoading = false;
            this.id = params.id;

            this.form.patchValue({
              title: post.title,
              image: post.imagePath,
              content: post.title
            });
          });
      }
    });
  }

  savePost(): void {
    this.isLoading = true;

    if ( this._mode === Modes.Create ) {
      const post: Post = {
        title: this.title.value,
        imagePath: this.image.value,
        content: this.content.value
      };

      this._postService.add(post);

      this.ngForm.resetForm();
    } else {
      const post: Post = {
        _id: this.id,
        title: this.title.value,
        content: this.content.value,
        imagePath: this.image.value
      };

      this._postService.update(post);
    }
  }

  pickImage(event: Event): void {
    const file = (event.target as HTMLInputElement).files[0];

    this.form.patchValue({ image: file });

    this.image.updateValueAndValidity();

    const fr = new FileReader();

    fr.onload = () => {
      this.imagePreview = fr.result;
    };

    fr.readAsDataURL(file);
  }

  get title(): AbstractControl {
    return this.form.get('title');
  }

  get image(): AbstractControl {
    return this.form.get('image');
  }

  get content(): AbstractControl {
    return this.form.get('content');
  }
}
