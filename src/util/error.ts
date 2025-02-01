const error_map = (error: unknown): string | unknown => {
  if (error instanceof Error) {
    return error.message;
  } else {
    return error;
  }
};
