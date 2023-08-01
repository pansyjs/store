<h1 align="center">
  @pansy/store
</h1>

## ✨ 特性

- 🌈 支持命名空间
- 📦 同时支持`localStorage`、`sessionStorage`、`cookie`，并提供一致性 API
- 🛡 使用 TypeScript 开发，提供完整的类型定义文件。

## 📦 安装

```sh
pnpm i @pansy/store
```

## 🔨 基本使用

```ts
import { Store } from '@pansy/store';

const store = new Store();

// 基本方法
store.setItem('foo', 'bar');
store.setItem('abc', 'xyz');

store.getItem('foo'); // return bar

store.removeItem('foo');

// 高级方法
store.check('local'); // 测试 localStorage 是否可用
```
## 🔨 高级使用

### Storages

```ts
import { Store } from '@pansy/store';

const store = new Store();

// 存储在 cookie 中
store.setItem('foo', 'bar', { 'storages': ['cookie'] });
// 存储在 localStorage 中
store.setItem('foo', 'bar', { 'storages': ['local'] });

// 首先尝试将其存储到 cookie 中，如果不能则存储到 localStorage 中
store.setItem('foo', 'bar', { 'storages': ['cookie', 'local'] });
```

### Namespaces

```ts
import { Store } from '@pansy/store';

const store = new Store();

// 设置到默认命名空间 
store.setItem('hello', 'world');
// 将数据存储在给定的命名空间下
store.setItem('hello', 42, { 'namespace': 'alt' });
basil.setItem('abc', 'def', { 'namespace': 'alt' });

store.getItem('hello'); // return 'world'
store.getItem('hello', { 'namespace': 'alt' }); // return 42
```

## 配置

```ts
{
  // 存储数据的命名空间
  // default: 'b45i1' 
  namespace: string;

  // 指定所有支持的存储和优先级顺序
  // default: ['local', 'cookie', 'session', 'memory']
  storages: ('local' | 'cookie' | 'session' | 'memory')[];

  // cookie 过期时间
  // default: 365
  expires: number;

  // 用于分隔命名空间和键名的值
  // default: '/'
  keyDelimiter: string;
}
```

## API
