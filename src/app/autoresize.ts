// An autoresize directive that works with ion-textarea in Ionic 2
// Usage example: <ion-textarea autoresize [(ngModel)]="body"></ion-textarea>
// Usage example: <ion-textarea autoresize="100" [(ngModel)]="body"></ion-textarea>
// Based on https://www.npmjs.com/package/angular2-autosize

import { Directive, HostListener, ElementRef, Input } from "@angular/core";

@Directive({
	selector: "ion-textarea[autoresize]" // Attribute selector
})
export class AutoresizeDirective {

	@HostListener('input', ['$event.target'])
	onInput(textArea: HTMLTextAreaElement): void {
		this.adjust();
  }

  @Input('autoresize') maxHeight: number;
  
	constructor(public element: ElementRef) {
  }
  
	ngOnInit(): void {
		this.adjust();
  }
  
	adjust(): void {
    let ta = this.element.nativeElement.querySelector("textarea"),
        newHeight;
		
		if (ta) {
			ta.style.overflow = "hidden";
      ta.style.height = "auto";
      if (this.maxHeight) {
      //console.log('this.maxHeight',this.maxHeight)
        newHeight = Math.min(ta.scrollHeight, this.maxHeight);
      //console.log('newHeight',newHeight)
      } else {
        newHeight = ta.scrollHeight;
      }
      ta.style.height = newHeight + "px";
		}
	}

}