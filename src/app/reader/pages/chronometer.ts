export class Chronometer {
  private static startTime:Date;
  private static endTime:Date;
  static start(){
    this.startTime = new Date();
  }
  static end() {
    this.endTime = new Date();
    let miliseconds = this.endTime.getTime()-this.startTime.getTime();
    console.log('miliseconds',miliseconds);
  }
}