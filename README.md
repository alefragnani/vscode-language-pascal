# iRite for Visual Studio Code

This extension adds support for the iRite Language to Visual Studio Code. It supports:

* Syntax Colorization
* Snippets
* Preprocessing
* Compiling
* Deployment to Indicator

# Installation

Click on the Extension tab, and type in iRite. Click install and allow VScode to restart. You now have syntax highlighting and snippets.

## Compilation and Deployment

* Ensure Revolution is installed: [Revolution](https://www.ricelake.com/en-us/products/product-details/revolution-scale-software#/resources-downloads "Revolution Scale Software")
* Click the "iRite: Build" button, this will initally generate an irite.settings.json file in your directory

### irite.settings.json

Defaults are established on build, but must be modified for which indicator you are deploying to. 
* indicator: 1280, 920, 880, 820
* ipaddress: If using TCP connection
* tcpport: If using TCP connection 
* comport: If using RS232
* baudrate: If using RS232
* databits: If using RS232
* parity: If using RS232
* stopbits: If using RS232

# Deployment

* Ensure the irite.settings.json file has been modified to your system specs and then click iRite: Deploy
