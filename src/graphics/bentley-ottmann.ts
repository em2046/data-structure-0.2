import {
  Comparable,
  equality,
  Hashable,
  Hasher,
  HashMap,
  HashSet,
  TreeSet,
} from "../core";
import { parallelogramSignedArea } from "./area";
import { lineLineIntersection } from "./intersection";
import { LineSegment } from "./line-segment";
import { Point } from "./point";
import { RedBlackTree } from "./red-black-tree";

const EPSILON = 1e-15;

enum EventType {
  Top = "TOP",
  Bottom = "BOTTOM",
  Intersection = "INTERSECTION",
}

enum SweepLineState {
  In = "IN",
  Out = "OUT",
}

class EventPoint implements Comparable {
  point: Point;
  type: EventType;

  constructor(point: Point, type: EventType) {
    this.point = point;
    this.type = type;
  }

  equality(rhs: EventPoint): boolean {
    const lhsPoint = this.point;
    const rhsPoint = rhs.point;

    return (
      Math.abs(lhsPoint.x - rhsPoint.x) < EPSILON &&
      Math.abs(lhsPoint.y - rhsPoint.y) < EPSILON
    );
  }

  lessThan(rhs: EventPoint): boolean {
    const lhsPoint = this.point;
    const rhsPoint = rhs.point;

    if (Math.abs(lhsPoint.y - rhsPoint.y) < EPSILON) {
      return rhsPoint.x - lhsPoint.x > EPSILON;
    }

    return rhsPoint.y - lhsPoint.y > EPSILON;
  }
}

class SweepLine {
  state: SweepLineState = SweepLineState.In;
  point: Point = new Point();
  line: LineSegment = new LineSegment<Point>(new Point(0, 0), new Point(1, 0));

  setPosition(point: Point) {
    const y = point.y;

    this.point = point;
    this.line = new LineSegment<Point>(new Point(0, y), new Point(1, y));
  }

  intersect(segment: LineSegment): Point {
    const { start, end } = segment;
    const point = this.point;

    if (equality(start, point)) {
      return start;
    } else if (equality(end, point)) {
      return end;
    } else {
      return lineLineIntersection(this.line, segment);
    }
  }
}

function slope(segment: LineSegment) {
  const start = segment.start;
  const end = segment.end;

  return (start.x - end.x) / (start.y - end.y);
}

function innerIntersection(lhs: LineSegment, rhs: LineSegment): boolean {
  const rhsStartSign = parallelogramSignedArea(lhs, rhs.start);
  const rhsEndSign = parallelogramSignedArea(lhs, rhs.end);
  const lhsStartSign = parallelogramSignedArea(rhs, lhs.start);
  const lhsEndSign = parallelogramSignedArea(rhs, lhs.end);
  let rhsInner = false;
  let lhsInner = false;

  if (
    (rhsStartSign >= 0 && rhsEndSign <= 0) ||
    (rhsStartSign <= 0 && rhsEndSign >= 0)
  ) {
    rhsInner = true;
  }

  if (
    (lhsStartSign >= 0 && lhsEndSign <= 0) ||
    (lhsStartSign <= 0 && lhsEndSign >= 0)
  ) {
    lhsInner = true;
  }

  return lhsInner && rhsInner;
}

interface FindIntersectionsReturn {
  topList: Point[];
  bottomList: Point[];
  resultMap: [Point, LineSegment[][]][];
}

export function findIntersections(
  segments: LineSegment[]
): FindIntersectionsReturn {
  const events = new TreeSet<EventPoint>();
  const topPointRecord = new HashMap<Point, StateSegment[]>();
  const bottomPointRecord = new HashMap<Point, StateSegment[]>();
  const intersectionRecord = new HashMap<Point, StateSegment[][]>();
  const status = new RedBlackTree<StateSegment>();
  const topList: Point[] = [];
  const bottomList: Point[] = [];
  const sweepLine = new SweepLine();
  const visitedRecord = new HashSet<Point>();

  class StateSegment implements Comparable, Hashable {
    segment: LineSegment;

    constructor(segment: LineSegment) {
      this.segment = segment;
    }

    equality(rhs: StateSegment): boolean {
      const lhsSegment = this.segment;
      const rhsSegment = rhs.segment;

      if (equality(lhsSegment, rhsSegment)) {
        return true;
      }

      const lhsIntersect = sweepLine.intersect(lhsSegment);
      const rhsIntersect = sweepLine.intersect(rhsSegment);

      if (Math.abs(lhsIntersect.x - rhsIntersect.x) < EPSILON) {
        const lhsSlope = slope(lhsSegment);
        const rhsSlope = slope(rhsSegment);

        return lhsSlope === rhsSlope;
      }

      return false;
    }

    lessThan(rhs: StateSegment): boolean {
      const lhsSegment = this.segment;
      const rhsSegment = rhs.segment;

      if (equality(lhsSegment, rhsSegment)) {
        return false;
      }

      const lhsIntersect = sweepLine.intersect(lhsSegment);
      const rhsIntersect = sweepLine.intersect(rhsSegment);

      if (Math.abs(lhsIntersect.x - rhsIntersect.x) < EPSILON) {
        const lhsSlope = slope(lhsSegment);
        const rhsSlope = slope(rhsSegment);

        if (
          sweepLine.point.x - lhsIntersect.x > EPSILON &&
          sweepLine.point.y - lhsIntersect.y > EPSILON
        ) {
          return lhsSlope > rhsSlope;
        } else {
          return lhsSlope < rhsSlope;
        }
      }

      return lhsIntersect.x < rhsIntersect.x;
    }

    hash(hasher: Hasher) {
      hasher.combine(this.segment);
    }
  }

  const stateSegments: StateSegment[] = segments.map((segment) => {
    return new StateSegment(segment);
  });

  stateSegments.forEach((stateSegment) => {
    const { start, end } = stateSegment.segment;
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
    events.add(top);
    events.add(bottom);

    const startSegmentList = topPointRecord.get(start);
    const endSegmentList = bottomPointRecord.get(end);

    if (startSegmentList === undefined) {
      topPointRecord.set(start, [stateSegment]);
    } else {
      startSegmentList.push(stateSegment);
    }

    if (endSegmentList === undefined) {
      bottomPointRecord.set(end, [stateSegment]);
    } else {
      endSegmentList.push(stateSegment);
    }
  });

  while (events.size > 0) {
    const event = events.min();

    events.deleteMin();

    if (event) {
      handleEventPoint(event);
    }
  }

  console.log("events", events);
  console.log("topPointRecord", topPointRecord);
  console.log("bottomPointRecord", bottomPointRecord);
  console.log("status", status);

  function handleEventPoint(event: EventPoint) {
    const point = event.point;
    const topSegments = topPointRecord.get(point);
    const bottomSegments = bottomPointRecord.get(point);
    const intersectionSegments = intersectionRecord.get(point);
    const topSet = HashSet.from<StateSegment>(topSegments ?? []);
    const bottomSet = new HashSet<StateSegment>();
    const intersectionSet = new HashSet<StateSegment>();
    let siblings: [StateSegment, StateSegment] | undefined;

    console.log("POINT", point);
    console.log(
      "status",
      [...status].map((s) => s.segment.id)
    );
    console.log(
      "events",
      [...events].map((e) => e.point)
    );

    sweepLine.state = SweepLineState.In;

    if (bottomSegments) {
      bottomSegments.forEach((state) => {
        bottomSet.add(state);
      });
    }

    if (intersectionSegments) {
      intersectionSegments.forEach((list) => {
        list.forEach((state) => {
          intersectionSet.add(state);
        });
      });
    }

    console.log("intersectionSegments", intersectionSegments);
    console.log("intersectionSet", intersectionSet);

    const overAllState = [...topSet, ...bottomSet, ...intersectionSet];
    const overAllSet: HashSet<StateSegment> =
      HashSet.from<StateSegment>(overAllState);

    if (overAllSet.size > 1) {
      const oldPoint = intersectionRecord.get(point);
      const uniqueOverAllStates = [...overAllSet];

      console.log("overAllSet", overAllSet, uniqueOverAllStates);

      if (oldPoint) {
        oldPoint.push(uniqueOverAllStates);
      } else {
        intersectionRecord.set(point, [uniqueOverAllStates]);
      }
    }

    const topAndIntersectionSet = HashSet.from<StateSegment>([
      ...topSet,
      ...intersectionSet,
    ]);
    const bottomAndIntersection = HashSet.from<StateSegment>([
      ...bottomSet,
      ...intersectionSet,
    ]);

    if (topAndIntersectionSet.size === 0) {
      const bottomList = [...bottomSet];

      console.log(bottomList);

      let left;
      let right;

      for (let i = 0; i < bottomList.length; i++) {
        const state = bottomList[i];

        if (status.has(state)) {
          console.log("STATE", state);

          let prev = status.previous(state);

          left = prev;

          console.log("PREV", prev);

          while (prev) {
            if (bottomSet.has(prev)) {
              left = prev;
              prev = status.previous(prev);
            } else {
              break;
            }
          }

          break;
        }
      }

      for (let i = 0; i < bottomList.length; i++) {
        const state = bottomList[i];

        if (status.has(state)) {
          let next = status.next(state);

          right = next;

          while (next) {
            if (bottomSet.has(next)) {
              right = next;
              next = status.next(next);
            } else {
              break;
            }
          }

          break;
        }
      }

      if (left && right) {
        siblings = [left, right];
      }
    }

    console.log("DELETE");

    bottomAndIntersection.forEach((state) => {
      console.log("delete", state);
      status.delete(state);
    });

    sweepLine.setPosition(point);
    console.log("ADD");
    sweepLine.state = SweepLineState.Out;
    visitedRecord.add(point);

    topAndIntersectionSet.forEach((state) => {
      if (!bottomSet.has(state)) {
        console.log("add", state);
        status.add(state);
      }
    });

    const topAndIntersection = [...topAndIntersectionSet];

    if (topAndIntersectionSet.size === 0) {
      console.log("EMPTY");
      console.log(point);

      if (siblings !== undefined) {
        const [left, right] = siblings;

        console.log("SIBLINGS", left, right);

        findNewEvent(left, right);
      }
    } else {
      let left;
      let right;

      console.log("NOT EMPTY");
      console.log(
        "status",
        [...status].map((s) => s.segment.id)
      );
      console.log("topAndIntersection", topAndIntersection);

      for (let i = 0; i < topAndIntersection.length; i++) {
        const state = topAndIntersection[i];

        if (status.has(state)) {
          left = state;

          let prev = status.previous(state);

          while (prev) {
            if (topAndIntersectionSet.has(prev)) {
              left = prev;
              prev = status.previous(prev);
            } else {
              break;
            }
          }

          break;
        }
      }

      let leftLeft;

      if (left) {
        leftLeft = status.previous(left);
      }

      console.log("LEFT", leftLeft, left);

      if (left && leftLeft) {
        findNewEvent(leftLeft, left);
      }

      for (let i = 0; i < topAndIntersection.length; i++) {
        const state = topAndIntersection[i];

        if (status.has(state)) {
          right = state;

          let next = status.next(state);

          while (next) {
            if (topAndIntersectionSet.has(next)) {
              right = next;
              next = status.next(next);
            } else {
              break;
            }
          }

          break;
        }
      }

      let rightRight;

      if (right) {
        rightRight = status.next(right);
      }

      console.log("RIGHT", right, rightRight);

      if (right && rightRight) {
        findNewEvent(right, rightRight);
      }
    }
  }

  function findNewEvent(lhs: StateSegment, rhs: StateSegment) {
    console.log("findNewEvent", lhs, rhs);

    const lhsSegment = lhs.segment;
    const rhsSegment = rhs.segment;
    const inner = innerIntersection(lhsSegment, rhsSegment);

    if (inner) {
      const intersection = lineLineIntersection(lhsSegment, rhsSegment);

      console.log("INTERSECTION", intersection);

      const currentPoint = sweepLine.point;

      if (Math.abs(currentPoint.y - intersection.y) < EPSILON) {
        if (currentPoint.x - intersection.x > EPSILON) {
          return;
        }
      } else if (currentPoint.y - intersection.y > EPSILON) {
        return;
      }

      const value: [StateSegment, StateSegment] = [lhs, rhs];
      const oldValues = intersectionRecord.get(intersection);

      if (oldValues) {
        oldValues.push(value);
      } else {
        events.add(new EventPoint(intersection, EventType.Intersection));
        intersectionRecord.set(intersection, [value]);
      }
    }
  }

  return {
    topList,
    bottomList,
    resultMap: [...intersectionRecord].map((item) => {
      const [key, value] = item;
      const segments: LineSegment[][] = value.map((states) => {
        return states.map((state) => {
          return state.segment;
        });
      });
      const point = new Point(key.x, key.y);

      return [point, segments];
    }),
  };
}
