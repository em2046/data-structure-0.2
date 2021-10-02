import { BinaryHeap, Comparable, HashMap, RedBlackTree } from "../core";
import { LineSegment } from "./line-segment";
import { Point } from "./point";

enum EventType {
  Top = "TOP",
  Bottom = "BOTTOM",
  Intersection = "INTERSECTION",
}

class EventPoint implements Comparable {
  point: Point;
  type: EventType;

  constructor(point: Point, type: EventType) {
    this.point = point;
    this.type = type;
  }

  equality(rhs: this): boolean {
    return this.point.x === rhs.point.x && this.point.y === rhs.point.y;
  }

  lessThan(rhs: this): boolean {
    if (this.point.y === rhs.point.y) {
      return this.point.x < rhs.point.x;
    }

    return this.point.y < rhs.point.y;
  }
}

export function findIntersections(segments: LineSegment[]): Point[] {
  const events = new BinaryHeap<EventPoint>();
  const endPointRecord = new HashMap<Point, LineSegment>();
  const intersectionRecord = new HashMap<Point, [LineSegment, LineSegment]>();
  const status = new RedBlackTree<LineSegment, unknown>();
  const topList: Point[] = [];
  const bottomList: Point[] = [];

  segments.forEach((segment) => {
    const start = segment.start;
    const end = segment.end;
    const points: [Point, Point] = [start, end];
    const ordered = points.sort((a, b) => {
      if (a.y - b.y === 0) {
        return a.x - b.x;
      }

      return a.y - b.y;
    });
    const top = new EventPoint(ordered[0], EventType.Top);
    const bottom = new EventPoint(ordered[1], EventType.Bottom);

    topList.push(ordered[0]);
    bottomList.push(ordered[1]);
    events.push(top);
    events.push(bottom);
    endPointRecord.set(start, segment);
    endPointRecord.set(end, segment);
  });

  console.log(events);
  console.log(endPointRecord);

  return topList;
}
