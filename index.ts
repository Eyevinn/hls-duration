import m3u8 from "@eyevinn/m3u8";
import fetch from "node-fetch";

const calcDuration = (mediaManifestUrl: URL) => new Promise<number>((resolve, reject) => {
  const parser = m3u8.createStream();

  parser.on("m3u", m3u => {
    let duration = 0;
    for (let i = 0; i< m3u.items.PlaylistItem.length; i++) {
      duration += m3u.items.PlaylistItem[i].get('duration');
    }
    resolve(duration);
  });

  fetch(mediaManifestUrl.href)
    .then(res => {
      res.body.pipe(parser);
    })
    .catch(reject);
});

/**
 * Fetch and calculate the actual duration of a VOD HLS stream
 * 
 * @param url where to locate the HLS stream
 * @returns duration in seconds
 */
export const hlsduration = (url: URL) => new Promise<number>((resolve, reject) => {
  const parser = m3u8.createStream();

  parser.on("m3u", m3u => {
    const streamItem = m3u.items.StreamItem[0];
    let baseUrl;
    const m = url.href.match(/^(.*)\/.*?$/);
    if (m) {
      baseUrl = m[1] + '/';
    }
    const mediaManifestUrl = new URL(streamItem.get("uri"), baseUrl);
    calcDuration(mediaManifestUrl).then(duration => {
      resolve(duration);
    });
  });

  fetch(url.href)
    .then(res => {
      res.body.pipe(parser);
    })
    .catch(reject);
});

