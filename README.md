## InFold browser extensions

 ![Chrome Web Store Version](https://img.shields.io/chrome-web-store/v/dfmmanoiegndhgdjendeidcakajifnlb?color=1a73e8&link=https://chromewebstore.google.com/detail/infold/dfmmanoiegndhgdjendeidcakajifnlb?hl=en)
 ![Chrome Web Store](https://img.shields.io/chrome-web-store/rating/dfmmanoiegndhgdjendeidcakajifnlb?color=1a73e8&link=https://chromewebstore.google.com/detail/infold/dfmmanoiegndhgdjendeidcakajifnlb?hl=en)
 ![Mozilla Add-on Version](https://img.shields.io/amo/v/infold?color=E66000&link=https%3A%2F%2Faddons.mozilla.org%2Fen-US%2Ffirefox%2Faddon%2Finfold%2F)
 ![Mozilla Add-on Rating](https://img.shields.io/amo/rating/infold?color=E66000&link=https%3A%2F%2Faddons.mozilla.org%2Fen-US%2Ffirefox%2Faddon%2Finfold%2F)

Currently supported browsers:
- Chrome
- IE
- Opera
- Firefox

Based on Manifest V3, read more about migrating to V3 here:
- https://developer.chrome.com/docs/extensions/develop/migrate
- https://extensionworkshop.com/documentation/develop/manifest-v3-migration-guide/

Chrome and Firefox use separate manifest files, located in ```manifest``` subfolder (v2.json is for legacy purposes).

### Development build commands

Build for Chrome, IE and Opera:

```npm run build```

Build for Firefox:

```npm run build-firefox```

### Production build commands

Production mode will minimize the package and exclude sourcemaps.

Build for Chrome, IE and Opera:

```npm run prod```

Build for Firefox:

```npm run prod-firefox```
