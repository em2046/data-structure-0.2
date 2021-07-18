/**
 * @public
 *
 * A class of types whose instance hold the value of an entity with stable
 * identity.
 */
export interface Identifiable {
  /**
   * The stable identity of the entity associated with this instance.
   */
  id: unknown;
}
