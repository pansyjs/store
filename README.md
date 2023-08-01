<h1 align="center">
  @pansy/store
</h1>

## ✨ 特性

- 🌈 支持命名空间
- 📦 支持`localStorage`、`sessionStorage`、`cookie`、`memory`，并提供一致性API
- 🛡 使用 TypeScript 开发，提供完整的类型定义文件。

## 📦 安装

```sh
pnpm i @pansy/store
```

## 🔨 示例

### 基本使用

```ts
import { Store } from '@pansy/store';

const store = new Store();

store.setItem('foo', 'bar');
store.setItem('abc', 'xyz');

basil.getItem('foo'); // return bar
```
