import { ChangeDetectionStrategy, Component, OnInit, ViewChild, Injector } from '@angular/core';
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
import { finalize, map, Observable, of, Subject, switchMap, timer } from 'rxjs';
import { tuiTypedFromEvent } from '@taiga-ui/cdk';

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

export class AddBlogComponent implements OnInit {
  @ViewChild(TuiEditorComponent)
  private readonly wysiwyg?: TuiEditorComponent;

  blogPostForm!: FormGroup;
  readonly rejectedFiles$ = new Subject<TuiFileLike | null>();
  readonly loadingFiles$ = new Subject<TuiFileLike | null>();
  readonly loadedFiles$: Observable<TuiFileLike | null>;
  activeIndex: number = 0;
  today = new Date();

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
    private fb: FormBuilder
    ) {
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

  // add the file to the editor view
  attach([file]: Array<any>): void {
    const tag = `${file.attrs?.type ?? ''}`.split('/')[0];

    this.wysiwyg?.editor
    ?.getOriginTiptapEditor()
    .commands.insertContent(
      `<${tag} controls width="100%"><source src="${file.link}" type="${file.attrs?.type}"></${tag}><p><a href="${file.link}" download="${file.name}">Download ${file.name}</a></p>`,
    );
  }

}
