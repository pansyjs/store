export type IEngine = 'localStorage' | 'sessionStorage';

export type ISameSite = 'strict' | 'lax' | 'none';

export type IStorageKey = 'local' | 'cookie' | 'session' | 'memory';

export type IStorages = IStorageKey[];

export interface ICookieAttributes {
  /**
   * 定义过期时间
   */
  expires?: number | Date | undefined;
  /**
   * 定义 cookie 可用的路径。
   * @default '/'
   */
  path?: string | undefined;
  /** 定义 cookie 可用的域名 */
  domain?: string | undefined;
  /**
   * 指示 cookie 的传输是否需要安全协议 (https)
   * @default false
   */
  secure?: boolean | undefined;
  /**
   * 断言一个 cookie 不应该被发送到跨域请求，提供一定的防止跨站请求伪造攻击（CSRF）的保护。
   */
  sameSite?: ISameSite | undefined;
}

export interface IOptions extends ICookieAttributes {
  /**
   * 存储数据的命名空间
   * @default 'ps45ii'
   */
  namespace?: string,
  /**
   * 指定所有支持的存储和优先级顺序
   * @default
   *   ['local', 'cookie', 'session', 'memory']
   */
  storages?: IStorages;
  /**
   * 用于分隔命名空间和键名的值
   * @default '/'
   */
  keyDelimiter?: string;
}

export type IEachCallback = (key: string, value: any) => void;

export interface IStorage<O extends Record<string, any> = {}> {
  /**
   * 检查是否可用
   * @returns
   */
  check: (options?: O) => boolean;

  /**
   * 添加数据
   * @param key 数据标识
   * @param value 数据值
   * @param options 参数
   * @returns
   */
  setItem: (key: string, value: any, options?: O) => void;

  /**
   * 获取数据
   * @param key
   * @returns
   */
  getItem: (key: string) => string | null;

  /**
   * 删除数据
   * @param key
   * @returns
   */
  removeItem: (key: string) => void;

  /**
   * 遍历存储数据
   * @param callback 回调函数
   * @returns
   */
  each: (callback: IEachCallback) => void;

  /**
   * 清空指定命名空间的存储数据，不提供命令空间则清空所有数据
   * @param namespace 命名空间
   * @returns
   */
  clear: (namespace?: string) => void;
}
