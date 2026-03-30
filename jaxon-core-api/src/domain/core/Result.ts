export class Result<T, E> {
  private constructor(
    private readonly value: T | null,
    private readonly error: E | null
  ) {}

  public static ok<T, E = never>(value: T): Result<T, E> {
    return new Result<T, E>(value, null);
  }

  public static err<T = never, E = unknown>(error: E): Result<T, E> {
    return new Result<T, E>(null, error);
  }

  public static async tryPromise<T, E>(args: {
    try: () => Promise<T>;
    catch: (error: unknown) => E;
  }): Promise<Result<T, E>> {
    try {
      const value = await args.try();
      return Result.ok<T, E>(value);
    } catch (error) {
      return Result.err<T, E>(args.catch(error));
    }
  }

  public match<R>(handlers: { ok: (value: T) => R; err: (error: E) => R }): R {
    if (this.error === null) {
      return handlers.ok(this.value as T);
    }

    return handlers.err(this.error);
  }
}

export const matchError = <R>(
  error: unknown,
  handlers: Record<string, (error: any) => R>
): R => {
  if (error instanceof Error && handlers[error.name]) {
    return handlers[error.name](error);
  }

  if (handlers.default) {
    return handlers.default(error);
  }

  throw error;
};
