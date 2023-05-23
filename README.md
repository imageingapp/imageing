<p align="center">
  <img src="https://imageing.org/assets/Mark.png" height="250" width="250" >
</p>

[![Android Build](https://github.com/ImageingApp/Imageing/actions/workflows/android-build.yml/badge.svg)](https://github.com/ImageingApp/Imageing/actions/workflows/android-build.yml)
[![iOS Build](https://github.com/ImageingApp/Imageing/actions/workflows/ios-build.yml/badge.svg)](https://github.com/ImageingApp/Imageing/actions/workflows/ios-build.yml)
[![GitHub Release](https://img.shields.io/github/v/release/ImageingApp/Imageing?include_prereleases)](https://github.com/ImageingApp/Imageing/releases/latest)
[![Discord](https://badgen.net/discord/online-members/9UK5ZcY6By)](https://discord.gg/9UK5ZcY6By)

| Android | iOS |
|:-:|:-:|
| [<img src="https://raw.githubusercontent.com/jitsi/jitsi-meet/master/resources/img/google-play-badge.png" height="50">](https://play.google.com/store/apps/details?id=org.imageing.app) | [<img src="https://raw.githubusercontent.com/jitsi/jitsi-meet/master/resources/img/appstore-badge.png" height="50">](https://play.google.com/store/apps/details?id=org.imageing.app) |

## About

imageing (and so are you!) is a modern file sharing app for Android and iOS.
It allows you to edit, upload and share files to a destination of your choice.

## Features

- ShareX Custom Uploader Support
- Upload History
- Capture Images and Videos
- Import/Export Configurations via QR Code

## Building

### Development

```bash
yarn android
```

### Production

```bash
eas build --platform android --profile preview --local
```

## Contributing

Before creating a fork, please read [the contribution guidelines](https://github.com/imageingapp/imageing/tree/main/.github/CONTRIBUTING.md).
