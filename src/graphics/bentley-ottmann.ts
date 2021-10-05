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
    return this.point.x === rhs.point.x && this.point.y === rhs.point.y;
  }

  lessThan(rhs: EventPoint): boolean {
    if (this.point.y === rhs.point.y) {
      return this.point.x < rhs.point.x;
    }

    return this.point.y < rhs.point.y;
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
  const status = new TreeSet<StateSegment>();
  const topList: Point[] = [];
  const bottomList: Point[] = [];
  const sweepLine = new SweepLine();
  const prevOrderMap = new HashMap<StateSegment, number>();
  const visitedRecord = new HashSet<Point>();

  class StateSegment implements Comparable, Hashable {
    segment: LineSegment;

    constructor(segment: LineSegment) {
      this.segment = segment;
    }

    equality(rhs: StateSegment): boolean {
      return equality(this.segment, rhs.segment);
    }

    lessThan(rhs: StateSegment): boolean {
      const lhsSegment = this.segment;
      const rhsSegment = rhs.segment;

      if (equality(lhsSegment, rhsSegment)) {
        return false;
      }

      // If (prevOrderMap.size) {
      //   const lhsPrevIndex = prevOrderMap.get(this);
      //   const rhsPrevIndex = prevOrderMap.get(rhs);
      //
      //   console.log("prevOrderMap", prevOrderMap, lhsPrevIndex, rhsPrevIndex);
      //
      //   if (
      //     typeof lhsPrevIndex === "number" &&
      //     typeof rhsPrevIndex === "number"
      //   ) {
      //     return lhsPrevIndex > rhsPrevIndex;
      //   }
      // }

      const lhsIntersect = sweepLine.intersect(lhsSegment);
      const rhsIntersect = sweepLine.intersect(rhsSegment);

      if (lhsIntersect.x === rhsIntersect.x) {
        const lhsSlope = slope(lhsSegment);
        const rhsSlope = slope(rhsSegment);
        const visited = visitedRecord.has(lhsIntersect);

        if (visited === false) {
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

  console.log(events);
  console.log(topPointRecord);
  console.log(bottomPointRecord);
  console.log(status);

  function findSegment(point: Point): StateSegment | undefined {
    const topSegments = topPointRecord.get(point);

    if (topSegments !== undefined) {
      for (let i = 0; i < topSegments.length; i++) {
        const topSegment = topSegments[i];

        if (status.has(topSegment)) {
          return topSegment;
        }
      }
    }

    const bottomSegments = bottomPointRecord.get(point);

    if (bottomSegments !== undefined) {
      for (let i = 0; i < bottomSegments.length; i++) {
        const bottomSegment = bottomSegments[i];

        if (status.has(bottomSegment)) {
          return bottomSegment;
        }
      }
    }

    const intersectionSegments = intersectionRecord.get(point);

    if (intersectionSegments !== undefined) {
      for (let i = 0; i < intersectionSegments.length; i++) {
        const intersectionSegment = intersectionSegments[i];

        if (status.has(intersectionSegment[0])) {
          return intersectionSegment[0];
        }

        if (status.has(intersectionSegment[1])) {
          return intersectionSegment[1];
        }
      }
    }
  }

  function handleEventPoint(event: EventPoint) {
    const point = event.point;
    const topSegments = topPointRecord.get(point);
    const bottomSegments = bottomPointRecord.get(point);
    const intersectionSegments = intersectionRecord.get(point);
    const topSet = HashSet.from<StateSegment>(topSegments ?? []);
    const preBottomSet = new HashSet<StateSegment>();
    const bottomSet = new HashSet<StateSegment>();
    const preIntersectionSet = new HashSet<StateSegment>();
    const intersectionSet = new HashSet<StateSegment>();
    const includes: StateSegment[] = [];

    console.log([...status].map((s) => s.segment.id));

    prevOrderMap.clear();

    sweepLine.state = SweepLineState.In;
    sweepLine.setPosition(point);

    const include = findSegment(point);

    if (bottomSegments) {
      bottomSegments.forEach((state) => {
        preBottomSet.add(state);
      });
    }

    if (intersectionSegments) {
      intersectionSegments.forEach((list) => {
        list.forEach((state) => {
          preIntersectionSet.add(state);
        });
      });
    }

    console.log(preBottomSet);
    console.log(preIntersectionSet);

    if (include) {
      includes.push(include);

      let previous = status.previous(include);
      let next = status.next(include);

      while (previous !== undefined) {
        includes.unshift(previous);
        previous = status.previous(previous);
      }

      while (next !== undefined) {
        includes.push(next);
        next = status.previous(next);
      }

      includes.forEach((state) => {
        const segment = state.segment;

        if (equality(segment.start, point)) {
          // Do nothing.
        } else if (equality(segment.end, point)) {
          if (preBottomSet.has(state)) {
            bottomSet.add(state);
          }
        } else {
          if (preIntersectionSet.has(state)) {
            intersectionSet.add(state);
          }
        }
      });
    }

    const overAllState = [...topSet, ...bottomSet, ...intersectionSet];
    const overAllSet: HashSet<StateSegment> =
      HashSet.from<StateSegment>(overAllState);

    if (overAllSet.size > 1) {
      const oldPoint = intersectionRecord.get(point);

      if (oldPoint) {
        oldPoint.push([...overAllSet]);
      } else {
        intersectionRecord.set(point, [[...overAllSet]]);
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

    console.log("DELETE");
    bottomAndIntersection.forEach((state) => {
      status.delete(state);
    });

    includes.forEach((state, index) => {
      prevOrderMap.set(state, index);
    });

    console.log("ADD");
    sweepLine.state = SweepLineState.Out;
    visitedRecord.add(point);

    topAndIntersectionSet.forEach((state) => {
      status.add(state);
    });

    const topAndIntersection = [...topAndIntersectionSet];

    if (topAndIntersectionSet.size === 0) {
      console.log("EMPTY");
      console.log(point);
      console.log(bottomSet);
    } else {
      let left;
      let right;

      console.log("NOT EMPTY");

      for (let i = 0; i < topAndIntersection.length; i++) {
        const state = topAndIntersection[i];

        left = state;

        if (status.has(state)) {
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

      console.log("LEFT", left, leftLeft);

      if (left && leftLeft) {
        findNewEvent(leftLeft, left);
      }

      for (let i = 0; i < topAndIntersection.length; i++) {
        const state = topAndIntersection[i];

        right = state;

        if (status.has(state)) {
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

    //
    // if (topSegments !== undefined) {
    //   topSegments.forEach((topSegment) => {
    //     // Console.log(topSegment);
    //
    //     status.add(topSegment);
    //   });
    // }

    // Console.log(point);
    // console.log(topSegments);
  }

  function findNewEvent(lhs: StateSegment, rhs: StateSegment) {
    console.log("findNewEvent", lhs, rhs);

    const lhsSegment = lhs.segment;
    const rhsSegment = rhs.segment;
    const inner = innerIntersection(lhsSegment, rhsSegment);

    if (inner) {
      const intersection = lineLineIntersection(lhsSegment, rhsSegment);

      console.log("intersection", intersection);

      const currentPoint = sweepLine.point;

      if (currentPoint.y === intersection.y) {
        if (currentPoint.x >= intersection.x) {
          return;
        }
      } else if (currentPoint.y >= intersection.y) {
        return;
      }

      events.add(new EventPoint(intersection, EventType.Intersection));

      const value: [StateSegment, StateSegment] = [lhs, rhs];
      const oldValues = intersectionRecord.get(intersection);

      if (oldValues) {
        oldValues.push(value);
      } else {
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
