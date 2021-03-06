import { hlsduration } from "./index";

test("Should fetch HLS and calculate correct duration", async () => {
  const duration = await hlsduration(new URL("https://maitv-vod.lab.eyevinn.technology/VINN.mp4/master.m3u8"));
  expect(duration).toEqual(105.72000000000001);
});

test("Should work as a promise", (done) => {
  hlsduration(new URL("https://maitv-vod.lab.eyevinn.technology/VINN.mp4/master.m3u8"))
  .then(duration => {
    expect(duration).toEqual(105.72000000000001);    
    done();
  });
});
