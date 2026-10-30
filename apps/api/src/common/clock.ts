// Zdroj času je injektovatelný, aby šly expirace a rotace testovat bez čekání.
export abstract class Clock {
  abstract now(): Date;
}

export class SystemClock extends Clock {
  now(): Date {
    return new Date();
  }
}
