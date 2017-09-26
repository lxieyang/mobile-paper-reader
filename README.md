# Paper Reader on Mobile Phones

<img width="50" src="preview/icon.png"/>

## Introduction

Ever experienced reading research papers on your phone? It sucked, right? The phone screens are just too small for those magnificant pdf documents people worked so hard to format.

With this app, you could just put in the link to the paper you want to read, wait a little while for the app to parse the pdf document using some advanced text extraction algorithms from [indico](indico.com), and then read the paper like you are reading a normal article on your phone screen. To illustrate, you just went from ***this***:

<img width="250" src="preview/reading-pdf.jpg" />

to **this**:

<img width="250" src="preview/reading-parsed-pdf.jpg" />

And of course, it comes in with the ability to adjust the font size and the background:

<img width="250" src="preview/settings.png" />

## Demo
Here's a demo of how to basically use this app:

<img width="250" src="preview/demo.gif" />


## Technologies

- [Indico](https://indico.io)'s `pdf_extraction` API is used to extract all the texts from a PDF file.
- This app is written using the [Ionic Framwork](https://ionicframework.com).


## Future work

- I plan to add caching to the app, so that users would be able to revisit the recent documents he/she read without additional web requests. This saves both the time and the data.
- I plan to better parse the text information to automatically extract ***title***, ***author***, ***subtitle*** information out. This will also lead to a better visual presentation of the text information.
- I plan to work with [Indico](https://indico.io) engineers to extract images from pdf document, as the current implementation does not present images from the original document. 

## Questions

I appreciate any suggestions! If you want a particular feature, please feel free to create an issue, and I'll address it ASAP!


## Author

- [Xieyang (Michael) Liu](https://lxieyang.github.io)     [Ph.D. student @ Carnegie Mellon University]