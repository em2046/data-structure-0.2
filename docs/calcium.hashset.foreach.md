<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@jiangshengdev/calcium](./calcium.md) &gt; [HashSet](./calcium.hashset.md) &gt; [forEach](./calcium.hashset.foreach.md)

## HashSet.forEach() method

Calls `callback` once for each value present in the hash set. If a `thisArg` parameter is provided, it will be used as the `this` value for each invocation of `callback`<!-- -->.

<b>Signature:</b>

```typescript
forEach(callback: (element: E, set: HashSet<E>) => void, thisArg?: any): void;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  callback | (element: E, set: [HashSet](./calcium.hashset.md)<!-- -->&lt;E&gt;) =&gt; void | Function to execute for each element. |
|  thisArg | any | Value to use as <code>this</code> when executing <code>callback</code>. |

<b>Returns:</b>

void

