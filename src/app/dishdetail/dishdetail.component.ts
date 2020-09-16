import { Component, OnInit, Input, ViewChild, Inject } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { DISHES } from '../shared/dishes';
import { switchMap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { visibility, flyInOut,expand } from '../animations/app.animation';


import { Comment } from '../shared/Comment';


@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
    },
    animations: [
      flyInOut(),
      visibility(),
      expand()
    ]
  
})
export class DishdetailComponent implements OnInit {
  @Input()
  dish: Dish;
 // comments = DISH.comments;
  dishIds: string[];
  currentDate = new Date();
  prev: string;
  next: string;
  @ViewChild('fform') CommentFormDirective;
  CommentForm: FormGroup;
  Comment: Comment;
  dishcopy: Dish;
  errMess: string ;
  visibility = 'shown';
  constructor(private dishservice: DishService,
    private route: ActivatedRoute,
    private location: Location,
    @Inject('BaseURL') public BaseURL,
    private fb: FormBuilder) { 
      this.createForm();
    }

  ngOnInit() {
    this.dishservice.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
    
    this.route.params
      .pipe(switchMap((params: Params) => {this.visibility = 'hidden';
      return this.dishservice.getDish(params['id']);}))
      .subscribe(dish => { this.dish = dish; this.dishcopy = dish; this.setPrevNext(dish.id);  this.visibility = 'shown'; },
        errmess => this.errMess = <any>errmess );
  }
  goBack(): void {
    this.location.back();
  }
  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }
  createForm(): void {
    this.CommentForm = this.fb.group({
      author: ['', [Validators.required, Validators.minLength(2) ]],
      comment: ['', [Validators.required ]],
      rating: 5
    });
    this.CommentForm.valueChanges
    .subscribe(data => this.onValueChanged(data));

  this.onValueChanged();
  }
  formErrors = {
    'author': '',
    'comment': ''

   
  };


  validationMessages = {
    'author': {
      'required':      'Author Name is required.',
      'minlength':     'Author Name must be at least 2 characters long.',
    
    },
    'comment': {
      'required':      'Comment is required.'
    
    },
   
  
  };
  onSubmit() {
    this.Comment = this.CommentForm.value;
    this.Comment.date = new Date().toISOString();
    console.log(this.Comment);
    this.dishcopy.comments.push(this.Comment);
    this.dishservice.putDish(this.dishcopy)
      .subscribe(dish => {
        this.dish = dish; this.dishcopy = dish;
      },
      errmess => { this.dish = null; this.dishcopy = null; this.errMess = <any>errmess; });
    this.CommentForm.setValue({
    author:'',
    comment:'',
    rating:5,
    }
    );
  }
  onValueChanged(data?: any) {
    if (!this.CommentForm) { return; }
    const form = this.CommentForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }
  
  

}
