import { ChangeDetectionStrategy, Component, OnInit, ViewChild, Injector, OnDestroy, NgZone, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  TUI_EDITOR_EXTENSIONS,
  TUI_ATTACH_FILES_LOADER,
  TUI_ATTACH_FILES_OPTIONS,
  TuiEditorTool,
  TuiEditorComponent,
  defaultEditorExtensions}
  from '@taiga-ui/addon-editor';
import { BehaviorSubject, map, Observable, of, Subject, takeUntil } from 'rxjs';
import { TuiDay, tuiTypedFromEvent } from '@taiga-ui/cdk';
import { MediaUploadService } from 'src/@core/common-services/media-upload.service';
import { AuthService } from 'src/app/auth/auth.service';
import { ApiResponse } from 'src/@core/models/api-response.model';
import { ResponseAddMedia } from 'src/@core/models/media-upload.model';
import { TuiDialogContext, TuiDialogService, TuiNotification } from '@taiga-ui/core';
import { profileImage } from 'src/app/auth/components/register/register.component';
import { NotificationsService } from 'src/@core/common-services/notifications.service';
import { BlogService } from '../../services/blog.service';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { BlogPost } from '../../models/blog.interface';
import { pluck } from 'rxjs/internal/operators/pluck';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import {PolymorpheusContent} from '@tinkoff/ng-polymorpheus';
import { db } from 'src/@core/indexdb/db';
import Editor from 'ckeditor5/build/ckeditor';

@Component({
  selector: 'app-add-blog',
  templateUrl: './add-blog.component.html',
  styleUrls: ['./add-blog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AddBlogComponent implements OnInit, OnDestroy {
  @ViewChild(TuiEditorComponent)
  private readonly wysiwyg?: TuiEditorComponent;
  editMode$ = new BehaviorSubject<boolean>(false);
  post$: any;
  blogPostForm!: FormGroup;
  readonly rejectedFiles$ = new Subject<boolean>();
  readonly loadingFiles$ = new Subject<boolean>();
  activeIndex: number = 0;
  today = new Date();
  uploadedImage: BehaviorSubject<profileImage | any> = new BehaviorSubject({
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
  public Editor: any = Editor;
  public editorConfig = {
    toolbar: {
			items: [
				'heading',
				'bold',
				'underline',
				'link',
				'alignment',
				'fontBackgroundColor',
				'fontColor',
				'fontFamily',
				'fontSize',
				'findAndReplace',
				'codeBlock',
				'code',
				'highlight',
				'bulletedList',
				'numberedList',
				'outdent',
				'indent',
				'imageInsert',
				'imageUpload',
				'blockQuote',
				'insertTable',
				'mediaEmbed',
				'undo',
				'redo',
				'horizontalLine',
				'specialCharacters',
				'pageBreak',
				'strikethrough',
				'subscript',
				'superscript'
			]
		},
		language: 'en',
		image: {
			toolbar: [
				'imageTextAlternative',
				'toggleImageCaption',
				'imageStyle:inline',
				'imageStyle:block',
				'imageStyle:side',
				'linkImage'
			]
		},
		table: {
			contentToolbar: [
				'tableColumn',
				'tableRow',
				'mergeTableCells',
				'tableCellProperties',
				'tableProperties'
			]
		}
  };
  dateValue: TuiDay | null = null;
  scheduleDateTime!: number;
  open = false;

  constructor(
    private fb: FormBuilder,
    private media: MediaUploadService,
    private auth: AuthService,
    private notif: NotificationsService,
    private blogService: BlogService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    @Inject(TuiDialogService) private readonly dialogService: TuiDialogService
    )
    {
      this.activatedRoute.params.pipe(pluck('id'), switchMap(id => id ? this.blogService.getPostById(id) : ''))
      .subscribe((val: any) => {
        if(val !== '') {
          this.post$ = val;
          if(Object.keys(this.blogService.sendBlogPostForEdit).length == 0) {
            this.initBlogPostForm(val);
            this.uploadedImage.next(val?.coverImage[0]);
            this.editMode$.next(true)
          }
        }
      });

      this.router.events.forEach((event: any) => {
        if(event instanceof NavigationStart) {
          this.blogService.sendBlogPostForEdit = {};
        }
      })
    }

  ngOnInit(): void {
    if(Object.keys(this.blogService.sendBlogPostForEdit).length > 0) {
      this.initBlogPostForm(this.blogService.sendBlogPostForEdit);
      this.uploadedImage.next(this.blogService.sendBlogPostForEdit?.coverImage[0]);
      this.editMode$.next(true)
    }
    else {
      this.editMode$.next(false)
      this.initBlogPostForm();
    }
  }

  initBlogPostForm(post?: BlogPost | any) {
    this.blogPostForm = this.fb.group({
      blogTitle: [
        post?.blogTitle || null, Validators.compose([Validators.required])
      ],
      blogSubtitle: [
        post?.blogSubtitle || null, Validators.compose([Validators.required])
      ],
      blogContent: [
        post?.blogContent ||null, Validators.compose([Validators.required])
      ],
      coverImage: [
        post?.coverImage || null, Validators.compose([Validators.required])
      ],
      deletedCheck: false,
      postedDate: post?.postedDate || this.today.getTime(),
      author: post?.author || (this.auth.currentUserValue?.username || `${this.auth.currentUserValue?.firstName}`),
      status: 'Draft',
      blogSlug: ''
    })
  }

  get f() {
    return this.blogPostForm.controls;
  }

  onDayClick(date: TuiDay): void {
    this.dateValue = date;
    const dateTimeStamp = new Date(
      date?.year,
      date?.month,
      date?.day,
      23,
      59,
      59,
      0
    ).getTime();
    this.scheduleDateTime = dateTimeStamp;
  }

  toggleDropdown(): void {
    this.open = !this.open;
  }

  onActiveZone(active: boolean): void {
    this.open = active && this.open;
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
    this.creatingPost$.next(true);
    this.f['blogSlug']?.setValue(this.f['blogTitle']?.value?.replace(/\s/g, '-').toLowerCase().replace(/:+/g, ''))
    if(this.editMode$.value == false) {
      this.blogService.createNewPost(this.blogPostForm.value).pipe(takeUntil(this.destroy$))
      .subscribe(async (res: ApiResponse<any>) => {
        if(!res.hasErrors()) {
          await db.blogPostsData.clear();
          this.notif.displayNotification('Successfully created new blog post', 'Post Creation', TuiNotification.Success);
          this.creatingPost$.next(false);
          let timeout: any;
          clearTimeout(timeout)
          timeout = setTimeout(() => this.router.navigate(['/view-posts']), 200);
        }
        else {
          this.creatingPost$.next(false);
          this.notif.displayNotification(res.errors[0].error?.message, 'Post Creation', TuiNotification.Error);
        }
      })
    }
    else {
      this.blogService.updatePost(this.blogPostForm.value, this.post$.id).pipe(takeUntil(this.destroy$))
      .subscribe(async (res: ApiResponse<any>) => {
        if(!res.hasErrors()) {
          await db.blogPostsData.clear();
          this.notif.displayNotification('Post updated successfully', 'Update Post', TuiNotification.Success);
          this.creatingPost$.next(false);
          let timeout: any;
          clearTimeout(timeout)
          timeout = setTimeout(() => this.router.navigate(['/view-posts']), 200);
        }
        else {
          this.creatingPost$.next(false);
          this.notif.displayNotification(res.errors[0].error?.message, 'Update Post', TuiNotification.Error);
        }
      })
    }
  }

  publishPost() {
    if(this.blogPostForm.valid) {
      this.f['status']?.setValue('Published');
      this.createPost()
    }
    else {
      this.notif.displayNotification('All fields are required', 'Create post', TuiNotification.Warning);
    }
  }

  savePostAsDraft() {
    if(this.blogPostForm.valid) {
      this.f['status']?.setValue('Draft');
      this.createPost();
    }
    else {
      this.notif.displayNotification('All fields are required', 'Create post', TuiNotification.Warning);
    }
  }

  schedulePost() {
    if(this.blogPostForm.valid) {
      this.f['status']?.setValue('Scheduled');
      this.f['postedDate']?.setValue(this.scheduleDateTime);
      this.createPost();
    }
    else {
      this.notif.displayNotification('All fields are required', 'Create post', TuiNotification.Warning);
    }
  }

  cancelPost(content: PolymorpheusContent<TuiDialogContext>): void {
    this.dialogService.open(content, {
      closeable: false,
      dismissible: false
    }).subscribe();
  }

  navigateAway() {
    this.router.navigate(['/view-posts'])
  }

  ngOnDestroy(): void {
    this.destroy$.complete();
    this.destroy$.unsubscribe();
  }

}

/**
 * PROVIDERS REFERENCE EXAMPLE
 *  providers: [
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
              //base64 or link to the file on your server
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
 */
