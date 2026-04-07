import { makeEmailLabel } from './makeEmailLabel';

export function getEntityOptions(entities = []) {
  return entities.map(entity => ({
    label: makeEmailLabel(entity),
    value: entity.id,
  }));
}
