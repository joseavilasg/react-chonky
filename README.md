<p align="center">
    <img src="https://chonky.io/chonky-logo-v2.png" alt="Chonky v2 Logo" width="500" />
    <br />
    <a href="https://www.npmjs.com/package/@bhunter179/chonky">
        <img
            alt="NPM package"
            src="https://img.shields.io/npm/v/@bhunter179/chonky.svg?style=flat&colorB=ffac5c"
        />
    </a>
    <a href="https://tldrlegal.com/license/mit-license">
        <img
            alt="MIT license"
            src="https://img.shields.io/npm/l/chonky?style=flat&colorB=dcd67a"
        />
    </a>
    <a href="https://discord.gg/4HJaFn9">
        <img
            alt="Chat on Discord"
            src="https://img.shields.io/discord/696033621986770957?label=discord&style=flat&colorB=08acee"
        />
    </a>
    <br />
    <br />
    <br />
</p>

Chonky is a file browser component for React. It tries to recreate the native file
browsing experience in your browser. This means your users can make selections, drag
& drop files, toggle between _List_ and _Grid_ file views, use keyboard shortcuts, and
much more!

This is a fork of [Chonky] by [TimboKZ].

[Chonky]: https://github.com/TimboKZ/Chonky
[TimboKZ]: https://github.com/TimboKZ

### Usage

Add to your app:

```typescript
import { FullFileBrowser } from '@bhunter179/chonky'

export function MyComponent() {
    return <FullFileBrowser
      files={[]}
      folderChain={[]}
    />
}
```

### [Click here for documentation and examples.](https://chonky.io/)

> Please [create an issue](https://github.com/aperturerobotics/react-chonky/issues) if you have a
> problem or want to request a feature.

## License

MIT © Aperture Robotics, LLC. 2023

MIT © [Tim Kuzhagaliyev](https://github.com/TimboKZ) 2020
