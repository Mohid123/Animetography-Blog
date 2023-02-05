import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { defaultEditorExtensions, TUI_EDITOR_EXTENSIONS } from '@taiga-ui/addon-editor';
import { TuiFileLike } from '@taiga-ui/kit';
import { finalize, map, Observable, of, Subject, switchMap, timer } from 'rxjs';

@Component({
  selector: 'app-add-blog',
  templateUrl: './add-blog.component.html',
  styleUrls: ['./add-blog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: TUI_EDITOR_EXTENSIONS,
      useValue: defaultEditorExtensions,
    },
  ],
})

export class AddBlogComponent implements OnInit {

  blogPostForm!: FormGroup;
  readonly rejectedFiles$ = new Subject<TuiFileLike | null>();
  readonly loadingFiles$ = new Subject<TuiFileLike | null>();
  readonly loadedFiles$: Observable<TuiFileLike | null>;

  constructor(private fb: FormBuilder) {
    this.initBlogPostForm();
    this.loadedFiles$ = this.f['coverImage'].valueChanges.pipe(
      switchMap(file => (file ? this.makeRequest(file) : of(null))),
    );
  }

  ngOnInit(): void { }

  initBlogPostForm() {
    this.blogPostForm = this.fb.group({
      blogTitle: [
        '', Validators.compose([Validators.required])
      ],
      blogSubtitle: [
        '', Validators.compose([Validators.required])
      ],
      blogContent: [
        '', Validators.compose([Validators.required])
      ],
      isFavorite: false,
      postedDate: [
        '', Validators.compose([Validators.required])
      ],
      coverImage: [
        '', Validators.compose([Validators.required])
      ],
      deletedCheck: false
    })
  }

  get f() {
    return this.blogPostForm.controls;
  }

  onReject(file: TuiFileLike | readonly TuiFileLike[]): void {
    this.rejectedFiles$.next(file as TuiFileLike);
  }

  removeFile(): void {
    this.f['coverImage']?.setValue(null)
  }

  clearRejected(): void {
    this.removeFile();
    this.rejectedFiles$.next(null);
  }

  makeRequest(file: TuiFileLike): Observable<TuiFileLike | null> {
    this.loadingFiles$.next(file);

    return timer(1000).pipe(
      map(() => {
        if (Math.random() > 0.5) {
          return file;
        }

        this.rejectedFiles$.next(file);

        return null;
      }),
      finalize(() => this.loadingFiles$.next(null)),
    );
}

}
