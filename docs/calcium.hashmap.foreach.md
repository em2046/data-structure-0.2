<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [calcium](./calcium.md) &gt; [HashMap](./calcium.hashmap.md) &gt; [forEach](./calcium.hashmap.foreach.md)

## HashMap.forEach() method

Calls `callback` once for each key-value pair present in the hash map. If a `thisArg` parameter is provided to `forEach`<!-- -->, it will be used as the `this` value for each callback.

<b>Signature:</b>

```typescript
forEach(callback: (value: V, key: K, map: HashMap<K, V>) => void, thisArg?: any): void;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  callback | (value: V, key: K, map: [HashMap](./calcium.hashmap.md)<!-- -->&lt;K, V&gt;) =&gt; void | Function to execute for each entry in the map. |
|  thisArg | any | Value to use as <code>this</code> when executing <code>callback</code>. |

<b>Returns:</b>

void
