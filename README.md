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


## News & Updates

- Sept 30, 2017: Indico engineers agreed to make changes to their APIs in order to support better image extraction and presentation. Excited! Will try to incorporate this change as soon as the new features are pushed!
- Sept 29, 2017: Now you are able to view recently-visited documents without additional web requests. It's all stored in the app!
- Sept 18, 2017: App released! Excited!

## Technologies

- [Indico](https://indico.io)'s `pdf_extraction` API is used to extract all the texts from a PDF file.
- This app is written using the [Ionic Framwork](https://ionicframework.com).


## Installation

You want to follow these general steps to install the app to your device:

- Install `Node.js`
- Install `Ionic`
- Clone the this repo
- For iOS users: Make sure you have a Mac. Run `ionic cordova build ios --prod` in the terminal. Open up the compiled project in Xcode, then install it to your phone.
- For Android users: Connect your phone to your computer. Make sure USB debugging is on. Run `ionic cordova build android --prod` in the terminal. This will install the app to your phone after you give it permission on your device.



## Future work

- I plan to add caching to the app, so that users would be able to revisit the recent documents he/she read without additional web requests. This saves both the time and the data.
- I plan to add a tab that shows all the history documents that you visited.
- I plan to better parse the text information to automatically extract ***title***, ***author***, ***subtitle*** information out. This will also lead to a better visual presentation of the text information.
- I plan to work with [Indico](https://indico.io) engineers to extract images from pdf document, as the current implementation does not present images from the original document. 

## Questions

I appreciate any suggestions! If you want a particular feature, please feel free to create an issue, and I'll address it ASAP!


## Author

- [Xieyang (Michael) Liu](https://lxieyang.github.io)     [Ph.D. student @ Carnegie Mellon University]