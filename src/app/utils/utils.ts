import { v4 as uuidV4 } from 'uuid';
export default class Utils {
  static genRoomId(): string {
    return uuidV4();
  }

  static getMediaStream(
    constraints?: MediaStreamConstraints
  ): Promise<MediaStream> {
    return new Promise<MediaStream>((resolve, reject) => {
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          resolve(stream);
        })
        .catch(() => {
          alert('Have an error when access to camera/micro');
          reject();
        });
    });
  }
}

export class Throttler {
  private static readonly THROTTLE_FACTOR = 2;
  private throttleCount = 0;

  public applyThrottle(): boolean {
    return this.throttleCount++ % Throttler.THROTTLE_FACTOR == 0;
  }
}
