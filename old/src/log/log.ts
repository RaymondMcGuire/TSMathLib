/*
 * @Author: Xu.Wang
 * @Date: 2020-04-16 18:33:40
 * @Last Modified by:   Xu.Wang
 * @Last Modified time: 2020-04-16 18:33:40
 */
export class LOG {
  static bLog: boolean = false

  static LOGGER(str: any) {
    if (this.bLog) console.log(str)
  }
}
