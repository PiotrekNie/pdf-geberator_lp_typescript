const wait: (arg: number) => void = async (ms: number) => {
  return new Promise((resolve: (arg: unknown) => void) => {
    setTimeout(resolve, ms);
  });
};

export default wait;
