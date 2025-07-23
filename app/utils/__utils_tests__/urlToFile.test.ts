import { urlToFile } from "../urlToFile";

describe("urlToFile function", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return a new file with all options", async () => {
    const fakeBlob = new Blob(["test"], { type: "image/jpeg" });
    (global.fetch as jest.Mock).mockResolvedValue({
      blob: async () => fakeBlob,
    });

    const url = "http://photo/";
    const filename = "newFile.jpg";
    const mimeType = "image/jpeg";

    const result = await urlToFile(url, filename, mimeType);

    expect(result).toBeInstanceOf(File);
    expect(result.name).toBe(filename);
    expect(result.type).toBe(mimeType);
  });
});
