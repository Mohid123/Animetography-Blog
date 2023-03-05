import { ChangeDetectionStrategy, Component, OnInit, ViewChild, Injector, OnDestroy, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  TUI_EDITOR_EXTENSIONS,
  TUI_ATTACH_FILES_LOADER,
  TUI_ATTACH_FILES_OPTIONS,
  TuiEditorTool,
  TuiEditorComponent,
  defaultEditorExtensions}
  from '@taiga-ui/addon-editor';
import { TuiFileLike } from '@taiga-ui/kit';
import { BehaviorSubject, finalize, map, Observable, of, Subject, switchMap, takeUntil, timer } from 'rxjs';
import { tuiTypedFromEvent } from '@taiga-ui/cdk';
import { MediaUploadService } from 'src/@core/common-services/media-upload.service';
import { AuthService } from 'src/app/auth/auth.service';
import { ApiResponse } from 'src/@core/models/api-response.model';
import { ResponseAddMedia } from 'src/@core/models/media-upload.model';
import { TuiNotification } from '@taiga-ui/core';
import { profileImage } from 'src/app/auth/components/register/register.component';
import { NotificationsService } from 'src/@core/common-services/notifications.service';
import { BlogService } from '../../services/blog.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-blog',
  templateUrl: './add-blog.component.html',
  styleUrls: ['./add-blog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: TUI_EDITOR_EXTENSIONS,
      useValue: [
        ...defaultEditorExtensions,
        import('@taiga-ui/addon-editor/extensions/youtube').then(
          ({Youtube}) => Youtube
        ),
        import('@taiga-ui/addon-editor/extensions/media').then(
          ({TuiVideo}) => TuiVideo,
        ),
        import('@taiga-ui/addon-editor/extensions/media').then(
          ({TuiSource}) => TuiSource,
        )
      ]
    },
    {
      provide: TUI_ATTACH_FILES_LOADER,
      deps: [],
      useFactory:
      () =>
      ([file]: File[]): Observable<
        Array<any>
        > => {
        const fileReader = new FileReader();

        // For example, instead of uploading to a file server,
        // we convert the result immediately into content to base64
        fileReader.readAsDataURL(file);

        return tuiTypedFromEvent(fileReader, 'load').pipe(
          map(() => [
            {
              name: file.name,
              /* base64 or link to the file on your server */
              link: String(fileReader.result),
              attrs: {
                type: file.type,
              },
            },
          ]),
        );
      },
    },
    {
      provide: TUI_ATTACH_FILES_OPTIONS,
      useValue: {
        accept: 'video/mp4,video/x-m4v,video/*,audio/x-m4a,audio/*',
        multiple: true,
      },
    },
  ]
})

export class AddBlogComponent implements OnInit, OnDestroy {
  @ViewChild(TuiEditorComponent)
  private readonly wysiwyg?: TuiEditorComponent;

  blogPostForm!: FormGroup;
  readonly rejectedFiles$ = new Subject<boolean>();
  readonly loadingFiles$ = new Subject<boolean>();
  activeIndex: number = 0;
  today = new Date();
  uploadedImage: BehaviorSubject<profileImage> = new BehaviorSubject({
    captureFileURL: '',
    blurHash: ''
  })
  uploadedImage$ = this.uploadedImage.asObservable();
  destroy$ = new Subject();
  creatingPost$ = new Subject<boolean>();
  readonly items = [
    {
      text: 'Create post',
      icon: '../../../../assets/add_file.svg',
    },
    {
      text: 'Preview',
      icon: '../../../../assets/preview.svg',
    }
];

  readonly builtInTools = [
    TuiEditorTool.Attach,
    TuiEditorTool.Bold,
    TuiEditorTool.Italic,
    TuiEditorTool.Details,
    TuiEditorTool.Align,
    TuiEditorTool.Img,
    TuiEditorTool.Hilite,
    TuiEditorTool.Link,
    TuiEditorTool.List,
    TuiEditorTool.Quote,
    TuiEditorTool.MergeCells,
    TuiEditorTool.Table,
    TuiEditorTool.RowsColumnsManaging,
    TuiEditorTool.Undo,
    TuiEditorTool.Anchor,
    TuiEditorTool.HR,
    TuiEditorTool.Clear,
    TuiEditorTool.Group
  ];

  constructor(
    private fb: FormBuilder,
    private media: MediaUploadService,
    private auth: AuthService,
    private notif: NotificationsService,
    private blogService: BlogService,
    private router: Router
    ) {
    this.initBlogPostForm();
  }

  ngOnInit(): void { }

  initBlogPostForm() {
    this.blogPostForm = this.fb.group({
      blogTitle: [
        null, Validators.compose([Validators.required])
      ],
      blogSubtitle: [
        null, Validators.compose([Validators.required])
      ],
      blogContent: [
        null, Validators.compose([Validators.required])
      ],
      coverImage: [
        null, Validators.compose([Validators.required])
      ],
      deletedCheck: false,
      author: this.auth.currentUserValue?.username || `${this.auth.currentUserValue?.firstName} ${this.auth.currentUserValue?.lastName }`
    })
  }

  get f() {
    return this.blogPostForm.controls;
  }

  removeFile(): void {
    this.f['coverImage']?.setValue(null);
    this.uploadedImage.next({
      captureFileURL: '',
      blurHash: ''
    })
  }

  makeRequestForFileUpload(event: any) {
    let file = event.target.files[0];
    if(file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/jpg') {
      this.loadingFiles$.next(true);
      this.media.uploadMedia('images', file).pipe(takeUntil(this.destroy$), map((response: ApiResponse<ResponseAddMedia>) => {
        if(!response.hasErrors()) {
          this.uploadedImage.next({
            captureFileURL: response.data?.url,
            blurHash: ''
          })
          return this.uploadedImage
        }
        else {
          this.loadingFiles$.next(false);
          return this.notif.displayNotification(response.errors[0]?.error?.message, 'An error has occured', TuiNotification.Error);
        }
      })).subscribe((response: any) => {
        this.f['coverImage']?.setValue([response.value]);
        this.loadingFiles$.next(false);
        this.notif.displayNotification('Image uploaded successfully', 'Success!', TuiNotification.Success)
      })
    }
    else {
      this.notif.displayNotification('Only JPEG/JPG and PNG files are allowed', 'File selection', TuiNotification.Warning);
    }
  }

  // add the file to the editor view
  attach([file]: Array<any>): void {
    const tag = `${file.attrs?.type ?? ''}`.split('/')[0];

    this.wysiwyg?.editor
    ?.getOriginTiptapEditor()
    .commands.insertContent(
      `<${tag} controls width="100%"><source src="${file.link}" type="${file.attrs?.type}"></${tag}><p><a href="${file.link}" download="${file.name}">Download ${file.name}</a></p>`,
    );
  }

  createPost() {
    if(this.blogPostForm.valid) {
      this.creatingPost$.next(true);
      this.blogService.createNewPost(this.blogPostForm.value).pipe(takeUntil(this.destroy$))
      .subscribe((res: ApiResponse<any>) => {
        if(!res.hasErrors()) {
          this.notif.displayNotification('Successfully created new blog post', 'Post Creation', TuiNotification.Success);
          this.creatingPost$.next(false);
          setTimeout(() => this.router.navigate(['/view-posts']), 200);
        }
        else {
          this.creatingPost$.next(false);
          this.notif.displayNotification(res.errors[0].error?.message, 'Post Creation', TuiNotification.Error);
        }
      })
    }
    else {
      this.notif.displayNotification('All fields are required', 'Create post', TuiNotification.Warning);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.complete();
    this.destroy$.unsubscribe();
  }

}
